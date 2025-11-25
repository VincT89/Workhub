import Joi from "joi";
import { handleRoutesErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";
import { comparePassword, generateAccessToken } from "../../../utils/auth.js";
import { User } from "../../../db/index.js";

export const login = async (req, res) => {
	const schema = Joi.object().keys({
		username: Joi.string().username().require(),
		password: Joi.string().required(),
	});

	try {
		const data = await schema.validateAsync(req.body);
		const user = await User.findOne({ username: data.username }, null, {
			lean: true,
		});

		if (!user) {
			return res
				.status(401)
				.json(formatResponse(null, false, "Not Authorized"));
		}

		if (!(await comparePassword(data.password, user.password))) {
			return res
				.status(401)
				.json(formatResponse(null, false, "Not Authorized"));
		}

		const token = await generateAccessToken({ _id: user._id });

		const { password, ...userInfo } = user;

		return res
			.status(200)
			.json(formatResponse({ token, user: userInfo }, true, "User logged in"));
	} catch (error) {
		return handleRoutesErrors(res, { error });
	}
};
