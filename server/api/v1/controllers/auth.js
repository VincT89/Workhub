import Joi from "joi";
import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";
import {
	comparePassword,
	generateAccessToken,
	hashPassword,
	generateTempPassword,
} from "../../../utils/auth.js";
import { User } from "../../../db/index.js";

/**
 * LOGIN dipendente
 * POST /api/v1/auth/login
 * body: { username, password }
 */
export const login = async (req, res) => {
	const schema = Joi.object({  // con Joi validiamo lo schema della richiesta, cioe i campi che ci aspettiamo
		username: Joi.string().required(), // username obbligatorio
		password: Joi.string().required(), // password obbligatoria
	});

	try {
		const { value, error } = schema.validate(req.body); // validiamo il body della richiesta cioe i dati inviati dal client

		if (error) {
			return res
				.status(400)
				.json(formatResponse(null, false, error.details[0].message));
		}

		const { username, password } = value; // estrazione dei valori validati

		// Cerca utente per username nel db e recupera hash password
		const userDoc = await User.findOne({ username }); // cerca utente per username nel db e recupera hash password

		if (!userDoc) {
			return res
				.status(401)
				.json(formatResponse(null, false, "Invalid credentials"));
		}

		// Controlla se l'utente è attivo 
		if (typeof userDoc.isActive !== "undefined" && userDoc.isActive === false) {
			return res
				.status(403)
				.json(formatResponse(null, false, "User is disabled"));
		}

		// DEBUG START
		console.log("DEBUG LOGIN:");
		console.log("Body username:", username);
		console.log("Body password:", password);
		console.log("User found in DB:", userDoc.username);
		console.log("Stored hash:", userDoc.password);
		console.log(
			"Compare result:",
			await comparePassword(password, userDoc.password)
		);
		// DEBUG END

		const isValid = await comparePassword(password, userDoc.password); // confronta la password inviata con l'hash memorizzato nel db

		if (!isValid) {
			return res
				.status(401)
				.json(formatResponse(null, false, "Invalid credentials"));
		}

    await userDoc.populate({
      path: "workplace", // popola il campo workplace con i dati del workplace associato
      select: "name location" // seleziona solo i campi name, location del workplace
    }); 

		const user = userDoc.toObject();
		// Tolgo password dall'oggetto utente prima di inviarlo al client in modo da non far vedere l'hash
		delete user.password;

		// Payload minimo nel token: id + ruolo
		const token = generateAccessToken({ // genera token JWT
			_id: userDoc._id.toString(),
			role: user.role,
		});

		return res.status(200).json(
			formatResponse(
				{
					token,
					user,
				},
				true,
				"Login successful"
			)
		);
	} catch (error) {
		return handleRouteErrors(res, { error });
	}
};

/**
 * REGISTER nuovo utente (solo ADMIN)
 * POST /api/v1/auth/register
 */
export const register = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),

    role: Joi.string().valid("admin", "user").default("user"),
    department: Joi.string().optional(),

    password: Joi.string().min(6).optional(), // se manca → generata automaticamente
    isGeneratedPassword: Joi.boolean().optional(),

    personnelNumber: Joi.number().required(),
    phone: Joi.number().optional(),

    workplace: Joi.string().required(), // ObjectId del workplace
    contractType: Joi.string().valid("indeterminato", "determinato", "part-time").optional(),
    hireDate: Joi.date().optional()
  });

  try {
    const { value, error } = schema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(formatResponse(null, false, error.details[0].message));
    }

    const {
      email,
      username,
      firstName,
      lastName,
      role,
      department,
      password,
      isGeneratedPassword,
      personnelNumber,
      phone,
      workplace,
      contractType,
      hireDate
    } = value;

    // Controllo duplicati email / username / personnelNumber
    const existing = await User.findOne({
      $or: [
        { email },
        { username },
        { personnelNumber }
      ]
    });

    if (existing) {
      return res.status(409).json(
        formatResponse(
          null,
          false,
          "Email, Username o Matricola già esistenti"
        )
      );
    }

    // Validazione workplace come ObjectId
    if (!workplace.match(/^[0-9a-fA-F]{24}$/)) { // semplice controllo formato ObjectId che e' una stringa esadecimale di 24 caratteri che rappresenta un identificatore univoco in MongoDB
      return res
        .status(400)
        .json(formatResponse(null, false, "workplace non valido (ObjectId non valido)"));
    }

    // Password: se non fornita → generiamo password temporanea
    const plainPassword = password || generateTempPassword(10);

    const hashedPassword = await hashPassword(plainPassword); // hash della password (fornita o generata)

    const newUserDoc = await User.create({
      email,
      username,
      password: hashedPassword,
      isGeneratedPassword: password ? false : true,
      firstName,
      lastName,
      role,
      department,
      personnelNumber,
      phone,
      workplace,
      contractType,
      hireDate
    });

    const newUser = newUserDoc.toObject(); // convertiamo il documento Mongoose in un oggetto JavaScript semplice cosi da poter manipolare i dati
    delete newUser.password; // rimuoviamo la password (hash) dall'oggetto utente prima di inviarlo al client

    return res.status(201).json(
      formatResponse(
        {
          user: newUser,
          tempPassword: password ? null : plainPassword
        },
        true,
        "User created successfully"
      )
    );
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * RECOVER PASSWORD
 * POST /api/v1/auth/recover
 * body: { email?, username? }
 */
export const recoverPassword = async (req, res) => {
  const schema = Joi.object({ // definiamo lo schema di validazione per la richiesta di recupero password 
    email: Joi.string().email().allow(null, ""), // email opzionale tramite allow(null, "")
    username: Joi.string().allow(null, "") // username opzionale tramite allow(null, "")
  });

  try {
    const { value, error } = schema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(formatResponse(null, false, error.details[0].message));
    }

    const { email, username } = value;

    if (!email && !username) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Provide email or username"));
    }

    // Trova l’utente
    const userDoc = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (!userDoc) {
      return res
        .status(404)
        .json(formatResponse(null, false, "User not found"));
    }

    // Genera password temporanea
    const tempPassword = generateTempPassword(10);
    const hashedPassword = await hashPassword(tempPassword);

    // Aggiorna l’utente
    userDoc.password = hashedPassword;
    userDoc.isGeneratedPassword = true;
    await userDoc.save();

    return res.status(200).json(
      formatResponse(
        {
          email: userDoc.email,
          tempPassword
        },
        true,
        "Temporary password generated"
      )
    );

  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};





