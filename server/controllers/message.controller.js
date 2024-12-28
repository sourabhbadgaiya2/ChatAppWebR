import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";

export const sendMessage = catchAsyncError(async (req, res, next) => {
  const { message } = req.body;

  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    message,
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
  }

  // await conversation.save();
  // await newMessage.save();

  // this will run in parallel
  await Promise.all([conversation.save(), newMessage.save()]);

  res.status(201).json(newMessage);
});

export const getAllMessage = catchAsyncError(async (req, res, next) => {
  const { id: userToChatId } = req.params;
  const senderId = req.user._id;

  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, userToChatId] },
  }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

  if (!conversation) return res.status(200).json([]);

  const message = conversation.messages;
  res.status(200).json(message);
});