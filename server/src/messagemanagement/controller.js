const Message = require("../../models/messages");

const saveMessage = async (props) => {
    try{
        const { to, from, message } = props;
        await Message.create({
            to,
            from,
            message
        })
        return true;
    }catch(err){
        throw new Error(err);
    }
}

const message = async (req, res) => {
    try{
        const baseUrl = req.baseUrl;
        const { page } = req.query;
        const { _id } = req.user;
        const options = {
            page: page,
            limit: 10,
            select: "message to from",
            sort: {createdAt: -1}
        };
        const messages = await Message.paginate({ $or: [{to: _id}, {from: _id}]}, options);
        let next = `${baseUrl}?page=${page+1}`;
        let previous = `${baseUrl}?page=${page-1}`;
        if(messages.page == 1){
            previous = null;
        }
        if(messages.page == messages.pages){
            next = null;
        }
        return res.status(200).json({
            count: messages.total,
            results: messages.docs,
            next,
            previous
         })
    }catch(err){
        return res.status(500).json(err);
    }
}

module.exports = {
    saveMessage,
    message
}