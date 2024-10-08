import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js"
import ErrorHandler from "../../middlewares/error.js"

export const userLogout = catchAsyncErrors(async(req,res, next) => {
    try{
        res.clearCookie("token")

        res.json({
            message : "Logged out successfully",
            error : false,
            success : true,
            data : []
        })
    }catch(err){
        return next(new ErrorHandler(err.message || "Server Error", 500))
    }
})


