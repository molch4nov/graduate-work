import UserModel from "../models/User.js";
import AnswersScheme from "../models/Answers.js";

const f = async () => {
    const result = await AnswersScheme.updateMany({year: 2023}, {
        $set: {current: true}
    });
}

f();