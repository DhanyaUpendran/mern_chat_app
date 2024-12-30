import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
export const sendMessage = async (req, res) => {
	try {
		const { messages } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;
        const cleanReceiverId = receiverId.replace(/^:/, '');
        // Validate senderId and receiverId as ObjectIds
         if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(cleanReceiverId)) {
        return res.status(400).json({ error: "Invalid sender or receiver ID" });
      }
    console.log("Sender ID:", senderId);
    console.log("Receiver ID:", receiverId);
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, cleanReceiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, cleanReceiverId],
			});
		}
		if (!conversation) {
			conversation = await Conversation.create({
			  participants: [senderId, cleanReceiverId],
			  messages: [], // Initialize the messages array
			});
		  }
	  
		  // Ensure `messages` exists
		  if (!conversation.messages) {
			conversation.messages = [];
		  }
	  

		const newMessage = new Message({
			senderId,
			receiverId: cleanReceiverId,
			messages,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
           
		}
		//Socket io functionality will go here


		await Promise.all([conversation.save(),newMessage.save()])
		
        res.status(201).json(newMessage) 
 
 
   }
   catch(error){
    console.log("Error in send Message controller :",error.message)
    res.status(500).json({error:"internal server error" });

    

   }
}
export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user?._id;
		const userToChatObjectId = new mongoose.Types.ObjectId(userToChatId);

		if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(userToChatObjectId)) {
			return res.status(400).json({ error: "Invalid sender or receiver ID" });
		  }
		 
		//   console.log(typeof senderId); // Should be 'object' (ObjectId)
        // console.log(typeof userToChatObjectId); 

		  console.log("Sender ID (as ObjectId):", senderId);
          console.log("User To Chat ID:", userToChatObjectId);


	const conversation = await Conversation.findOne({
		participants: { $all: [senderId, userToChatObjectId] },
	  }).populate("messages");
		
	  if (!conversation) {
		console.log("No conversation found between the users.");
		return res.status(200).json([]);
	  }
		

		if (!conversation){return res.status(200).json([]);}
		

		const messages = conversation.messages;
		console.log("Populated Messages:", conversation.messages);

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};