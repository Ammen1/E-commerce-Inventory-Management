import { catchAsyncErrors } from "../../middlewares/catchAsyncError"
import ErrorHandler from "../../middlewares/error"
import User from "../../models/user.Model"

export const userDetailsController = catchAsyncErrors(async (res, req, next) => {
    try{
        console.log("userId",req.userId)
        const user = await User.findById(req.userId)

        res.status(200).json({
            data : user,
            error : false,
            success : true,
            message : "User details"
        })

        console.log("user",user)

    }catch(err){
        return next(new ErrorHandler(err.message || "Server Error", 500))
    }

})
