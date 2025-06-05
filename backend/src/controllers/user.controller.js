import User from "../models/User.js"
import FriendRequest from "../models/FriendRequest.js"

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id
    const currentUser = req.user

    const recommendedUsers = await User.find({
      $and: [
        {_id: {$ne: currentUserId}}, // exclude current user
        {$id: {$nin: currentUser.friends}}, // exclude current user friends
        {isOnboarded:true}
      ]
    })
    res.status(200).json(recommendedUsers)
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message)
    res.status(500).json({message:"Internal server error"})    
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
    .select("friends")
    .populate("friends","fullName","profilePic","nativeLanguage","learningLanguage")

    res.status(200).json(user.friends)
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message)
    res.status(500).json({message:"Internal Server Error"})
    
  }  
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id
    const {id:recipientId} = req.params

    // prevent req to self
    if(myId === recipientId) {
      return res.status(400).json({message:"You cannot send a friend request to yourself"})  
    }

    const recipient = await User.findById(recipientId)
    if(!recipient) {
      return res.status(404).json({message:"Recipient not found"})
    }

    // user is already friends
    if(recipient.friends.includes(myId)) {
      return res.status(400).json({message:"You are already friends with this user"})
    }

    // req already exists
    const existingRequest = await FriendRequest.findOne({

    })

  } catch (error) {
    
  }
}