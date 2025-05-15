const UserModel = require("../models/User");
const { Webhook } = require("svix");

const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verifying Headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        // Getting Data from request body
        const { data, type } = req.body;

        // Switch Cases for different Events
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                   username: data.first_name + " "+ data.last_name,
                    image: data.image_url,
                };
                await UserModel.create(userData);
                res.json({});
                break;
            }

            case 'user.updated': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                   username: data.first_name + " "+ data.last_name,
                    image: data.image_url,
                };
                await UserModel.findOneAndUpdate({ _id: data.id }, userData);
                res.json({});
                break;
            }

            case 'user.deleted': {
                await UserModel.findOneAndDelete({ _id: data.id });
                res.json({});
                break;
            }

            default:
                res.json({ message: "Unhandled event type" });
                break;
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

module.exports = { clerkWebhooks };
