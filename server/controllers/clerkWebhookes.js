const User = require("../models/User");
const { Webhook } = require("svix");

const clerkWebhooks = async (req, res) => {
    try {

        // Create a Svix instance with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // Verifying Headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        // Getting Data from request body
        const { data, type } = req.body

        // Switch Cases for differernt Events
        switch (type) {
            case 'user.created': {

                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    recentSearchedCities:""
                }
                await User.create(userData)
                res.json({})
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    username: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    recentSearchedCities:""
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }
            default:
                break;
        }

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

module.exports = { clerkWebhooks };
