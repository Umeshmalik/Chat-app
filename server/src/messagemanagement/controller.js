const Message = require("../../models/messages");

const saveMessage = async (props) => {
    try{
        const { to, from, message } = props;
        const msg = await Message.create({
            to,
            from,
            message
        })
        return msg;
    }catch(err){
        throw new Error(err);
    }
}

const message = async (req, res) => {
    try{
        const baseUrl = req.baseUrl;
        const page = parseInt(req.query.page);
        const userId = req.query.userId;
        const { _id } = req.user;
        const options = {
            page: page,
            limit: 10,
            select: "message to from createdAt",
            sort: {createdAt: -1}
        };
        const query = {$or: [{to: userId, from: _id}, {from: userId, to: _id}]};
        const messages = await Message.paginate(query, options);
        let next = `${baseUrl}?page=${page+1}&userId=${userId}`;
        let previous = `${baseUrl}?page=${page-1}&userId=${userId}`;
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