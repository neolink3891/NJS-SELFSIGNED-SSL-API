export default class MessagesDAO {
    static messages;

    static async injectDB(conn) {
        if (MessagesDAO.messages) {
            return;
        }
        try {
            MessagesDAO.messages = await conn.db(process.env.MDB_NS).collection('messages');
        } catch (e) {
            console.error('unable to connect in MessagesDAO');
        }
    }

    static async getMessagesByScreen({
        filters = null,
        page = 0,
        resultPerPage = 20
    } = {}) {
        let query;
        let d_starts = new Date();
        let d_ends = new Date();
        d_ends.setDate(d_starts.getDate() + 2);

        if (filters) {
            query = {active: {$eq: "1"}, 'starts': {$lt: d_starts.toISOString().substring(0,10) + 'T23:59:59.000'}, 'ends': {$gt: d_ends.toISOString().substring(0,10) + 'T00:00:00.000'}};   
            
            if('site' in filters) {
                query = { ...query, site: {$eq: filters.site }};
            }
            if('screen' in filters) {
                query = { ...query, screen: {$eq: filters.screen }};
            }
            if('pub_login' in filters) {
                query = { ...query, pub_login: {$eq: filters.pub_login }};
            }
        }

        let cursor;
        try {
            cursor = await MessagesDAO.messages
                .find(query)
                .limit(resultPerPage)
                .skip(resultPerPage * page)
            const messageList = await cursor.toArray();
            const totalNumMessages = await MessagesDAO.messages.countDocuments(query);
            return { messageList, totalNumMessages };
        } catch (e) {
            console.error('Unable to get Filtered Messages');
            return {messageList: [], totalNumMessages: 0};
        }
    }
}