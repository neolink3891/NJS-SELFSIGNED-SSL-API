import MessagesDAO from '../dao/MessagesDAO.js';

export default class MessagesController {

    static async getLocalMessages(req, res, next) {
        const resultPerPage = req.query.resultPerPage ? parseInt(req.query.resultPerPage) : 20;
        const page = req.query.page ? parseInte(req.query.page) : 0;
        let totfilter = 0;

        const filters = {};
        if (req.body.site) {filters.site = req.body.site; totfilter += 1;}
        if (req.body.screen) {filters.screen = req.body.screen; totfilter += 1;}
        if (req.body.pub_login) {filters.pub_login = req.body.pub_login; totfilter += 1;}

        if (totfilter > 0) {
            const {messageList, totalNumMessages} = await MessagesDAO.getMessagesByScreen({ filters, page, resultPerPage });
            const response = {
                status: 'completed',
                code: '1',
                message: 'success',
                messages: messageList,
                page,
                filters,
                total_results: totalNumMessages
            };

            res.json(response); 
        } else {
            res.json({
                status: 'completed',
                code: '0',
                message: 'no filter passed',
                messages: [],
                page: '0',
                filters,
                total_results: '0'
            });
        }
    }
}