import mongoose from "mongoose";

const financialRecordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
});

//this will create the db title in the mongodb
const FinancialRecord =
  mongoose.models.FinancialRecord ||
  mongoose.model("FinancialRecord", financialRecordSchema);
export default FinancialRecord;
