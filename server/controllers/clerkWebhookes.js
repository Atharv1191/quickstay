const User = require("../models/User");
const { Webhook } = require("svix");

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        console.log("Clerk webhook received");

        // Get headers from request
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // Verify the webhook
        await whook.verify(JSON.stringify(req.body), headers);

        const { data, type } = req.body;
        const userData = {
            _id: data.id,
            email: data.email_addresses?.[0]?.email_address || "",
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        };

        switch (type) {
            case "user.created": {
                await User.create(userData);
                break;
            }

            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                break;
            }

            default:
                break;
        }

        res.json({
            success: true,
            message: "Webhook received",
        });

    } catch (error) {
        console.error(error.message);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { clerkWebhooks };
