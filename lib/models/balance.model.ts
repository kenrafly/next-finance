import mongoose from "mongoose";

const balanceRecordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
});

//this will create the db title in the mongodb
const BalanceRecord =
  mongoose.models.BalanceRecord ||
  mongoose.model("BalanceRecord", balanceRecordSchema);
export default BalanceRecord;
