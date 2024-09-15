const upload = require("../middleware/multer");
const Customer = require("../models/Customer");

const addCustomer = async (req, res) => {
    try {
        const { first_name, last_name, city, company } = req.body
        if (!first_name || !last_name || !city || !company) {
            throw new Error('Some Fields Are Missing')
        }
        const newCustomer = new Customer({
            first_name: first_name,
            last_name: last_name,
            city: city,
            company: company
        })
        const savedCustomer = await newCustomer.save();
        res.status(201).json({ status: true, data: savedCustomer, error: null })
    } catch (error) {
        res.status(500).json({ status: false, data: {}, error: error.message })
    }
};

const editCustomer = async (req, res) => {
    try {
        upload.single('file')(req, res, async function (err) {
            if (err) {
                throw new Error(err.message)
            }
            const { first_name, last_name, city, company } = req.body
            if (!first_name || !last_name || !city || !company) {
                throw new Error('Some Fields Are Missing')
            }
            let data = {
                first_name: first_name,
                last_name: last_name,
                city: city,
                company: company
            }
            await Customer.findByIdAndUpdate(req.params.id, { $set: data }, { new: true })
        })
        res.status(200).json({ status: true, data: "data updated", error: null })
    } catch (error) {
        res.status(500).json({ status: false, data: {}, error: error.message })
    }
};

const listAllCustomers = async (req, res) => {
    try {
        let criteria = {};
        if (req.query.search && req.query.search.trim()) {
            criteria.$or = [];
            const names = req.query.search.split(' ').filter(Boolean);
            const searchRegex = names.map(name => new RegExp(`^${name}`, 'i'));

            if (names.length > 1) {
                criteria.$or = [
                    { first_name: searchRegex[0], last_name: searchRegex[1] },
                    { first_name: searchRegex[1], last_name: searchRegex[0] },
                    { city: { $regex: searchRegex[0] } }
                ]
            } else {
                criteria.$or = [
                    { first_name: { $regex: searchRegex[0] } },
                    { last_name: { $regex: searchRegex[0] } },
                    { city: { $regex: searchRegex[0] } }
                ]
            }
        }
        const countDoc = await Customer.countDocuments();

        const findCustomers = await Customer.find(criteria).skip(Number(req.query.pageNo - 1) * req.query.limit).limit(req.query.limit);
        res.status(200).json({ status: true, data: findCustomers, totalCount: countDoc, error: null })
    } catch (error) {
        res.status(500).json({ status: false, data: [], error: error.message })
    }
};

const listCustomerById = async (req, res) => {
    try {
        const findCustomerData = await Customer.findById(req.params.id);
        res.status(200).json({ status: true, data: findCustomerData, error: null })
    } catch (error) {
        res.status(500).json({ status: false, data: {}, error: error.message })
    }
};

const listCustomerByCity = async (req, res) => {
    try {
        const getAllCustomers = await Customer.find();
        let allCities = [];
        getAllCustomers.forEach((item, index) => {
            let cityIndex = allCities.findIndex((data) => data.city == item.city);
            if (cityIndex == -1) {
                allCities.push({ city: item.city, noofcustomers: 1 })
            } else {
                allCities[cityIndex].noofcustomers += 1
            }
        })
        res.status(200).json({ status: true, data: allCities, error: null })
    } catch (error) {
        res.status(500).json({ status: false, data: [], error: error.message })
    }
};

module.exports = {
    addCustomer: addCustomer,
    editCustomer: editCustomer,
    listAllCustomers: listAllCustomers,
    listCustomerById: listCustomerById,
    listCustomerByCity: listCustomerByCity
}