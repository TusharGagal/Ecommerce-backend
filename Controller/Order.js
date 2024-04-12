const { Order } = require("../Models/Order");

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    // const result = await doc.populate("product");
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.fetchOrderByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orderItems = await Order.find({ user: userId });
    res.status(200).json(orderItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  //we need all query strings.
  //sort={_sort:"price",_order:"desc"};
  //Pagination={_page:1,_limit=10}

  let query = Order.find({});
  let totalOrdersQuery = Order.find({});

  //TODO: get sorting from discounted price not on actual price

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalOrdersQuery = totalOrdersQuery.sort({
      [req.query._sort]: req.query._order,
    });
  }
  const totalDocs = await totalOrdersQuery.count().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
    totalOrdersQuery = totalOrdersQuery
      .skip(pageSize * (page - 1))
      .limit(pageSize);
  }

  try {
    const doc = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
