import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";
import { AffiliateProgram, Client, Order } from "../../../db/index.js";
import { generateRandomCardNumber } from "../../../utils/random.js";
import Joi from "joi";

/**
 * GET /api/v1/customers
 * Admin, user
 * Restituisce tutti i clienti
 */

/* { lean: true }: Restituisce oggetti JavaScript semplici (più veloci) */
export const getCustomers = async (req, res) => {
  try {
    const customers = await Client.find({}, null, { lean: true })
      .populate({
        path: "affiliateProgram",
        select: "name points cardNumber"
      });

    return res
      .status(200)
      .json(formatResponse(customers, true, "Customers list"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * GET /api/v1/customers/:id
 * Admin, user
 * Restituisce un singolo customer per ID
 */

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params; //{ id } -> destructuring
    //req.params contiene tutti i parametri dinamici dell'URL (i parametri dinamici sono la parte dell'URL dopo i : che varia a seconda del cliente)

    // Validazione ID (formato ObjectId) in modo semplice per MongoDB per evitare errori di formato
    // Perché validare? Se l'ID non è valido, findById() darebbe errore
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid customer ID"));
    }

    // Cerco cliente
    const customer = await Client.findById(id).populate({ // findById(id) in (id) viene passato l'id estratto da const { id } = req.params
      path: "affiliateProgram",
      select: "name points cardNumber"
    }).lean(); // lean() per ottenere un oggetto semplice
    const orders = await Order.find({
      clients: {
        $elemMatch: {
          client: customer._id,
        }
      }
    }).populate(["product", "pointOfSales"]).lean();

    if (!customer) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Customer not found"));
    }

    customer.orders = orders.map(order => {
      return {
        _id: order._id,
        pointOfSales: order.pointOfSales,
        product: order.product,
        quantity: (order.clients.find(client => client.client.toString() == customer._id.toString()))?.quantity,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
    }
    })  || [];

    return res
      .status(200)
      .json(formatResponse(customer, true, "Customer found"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * POST /api/v1/customers
 * Admin, user
 * Crea un nuovo customer
 */

export const createCustomer = async (req, res) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    location: Joi.object().keys({
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    birthDate: Joi.string().required(),
    fiscalCode: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    affiliateProgram: Joi.object().keys({
      name: Joi.string().valid("standard", "premium").default("standard"),
    })
  })

  try {
    // req.body contiene i dati del nuovo cliente inviati dal frontend
    // usiamo body e non params visto che dobbiamo agire sul body della chiamata
    const { affiliateProgram: { name: affiliateProgramName }, ...customerData } = await schema.validateAsync(req.body);

    const cardNumber = generateRandomCardNumber(6, true);

    // CREA IL PROGRAMMA FEDELTÀ 
    const affiliateProgram = new AffiliateProgram({
      name: "standard",
      points: 0,
      cardNumber: cardNumber, // ricorda di trovare il modo di generarne uno automaticamente
    });

    // ASSOCIA IL PROGRAMMA AL CUSTOMER
    customerData.affiliateProgram = affiliateProgram._id;

    // Creo un nuovo cliente con i dati ricevuti
    const newCustomer = new Client(customerData);

    // Associo il cliente al programma fedeltà
    affiliateProgram.name = affiliateProgramName;
    affiliateProgram.user = newCustomer._id;

    // Salvo il cliente nel database
    await affiliateProgram.save(); // save() è un metodo di mongoose
    await newCustomer.save();

    // Ricarico il cliente con i dati popolati del programma fedeltà
    const populatedCustomer = await Client.findById(newCustomer._id).populate({ // grazie a newCustomer._id riusciamo a recuperare il cliente che abbiamo appena generato e salvato nel db con save() (riga 81)
      // scriviamo _id e non semplicemente id perchè il _ è la convenzione per gli id di MongoDB
      path: "affiliateProgram",
      select: "name points cardNumber"
    }).lean();

    return res
      .status(201) // 201 Created è lo status per risorse appena create
      .json(formatResponse(populatedCustomer, true, "Customer added successfully"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * PATCH /api/v1/customers/:id
 * Admin, user
 * Aggiorna un cliente esistente
 */

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params; //quale customer aggiornare

    // Validazione ID (formato ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid customer ID"));
    }

    // req.body contiene i dati da aggiornare
    const updateData = req.body; //cosa aggiornare

    // Aggiorno il cliente nel database
    const updatedCustomer = await Client.findByIdAndUpdate(id, updateData, {
      new: true, // { new: true } → restituisce il customer aggiornato (non quello vecchio)
      runValidators: true,  // { runValidators: true } → esegue le validazioni del model, cioè si assicura che vengano rispettate i valori required presenti nel modello
    }).populate({
      path: "affiliateProgram",
      select: "name points cardNumber"
    });

    if (!updatedCustomer) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Customer not found"));
    }

    return res
      .status(200)
      .json(formatResponse(updatedCustomer, true, "Customer updated successfully"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * DELETE /api/v1/customers/:id
 * Solo admin
 * Elimina un cliente
 */

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validazione ID (formato ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid customer ID"));
    }

    // Elimino il customer dal database
    const deletedCustomer = await Client.findByIdAndDelete(id); //trova il customer nel datatbase tramite id e lo elimina

    if (!deletedCustomer) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Customer not found"));
    }

    return res
      .status(200)
      .json(formatResponse(null, true, "Customer deleted successfully"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};