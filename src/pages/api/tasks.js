import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('taskDB');
        const tasksCollection = db.collection('tasks');

        if (req.method === 'GET') {
            const status = req.query.status || 'active';
            const tasks = await tasksCollection.find({ status }).toArray();
            res.status(200).json({ tasks });
        }

        if (req.method === 'POST') {
            const { text, dateCreated } = req.body;
            const newTask = { text, status: 'active', dateCreated };
            await tasksCollection.insertOne(newTask);
            res.status(200).json({ message: 'Task added successfully' });
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            await tasksCollection.deleteOne({ _id: new ObjectId(id) });
            res.status(200).json({ message: 'Task deleted successfully' });
        }

        if (req.method === 'PATCH') {
            const { id } = req.query;
            const { status } = req.body;
            await tasksCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { status } }
            );
            res.status(200).json({ message: 'Task status updated' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        await client.close();
    }
}
