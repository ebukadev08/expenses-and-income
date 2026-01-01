exports.validateTransaction = (req, res, next) => {
  const { title, amount, category, description, date } = req.body;
  if (!title || !category || !description || !date) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  if (typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number!" });
  }

  next();
};
