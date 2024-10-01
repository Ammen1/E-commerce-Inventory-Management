import { catchAsyncErrors } from "../../middlewares/catchAsyncError"
import ErrorHandler from "../../middlewares/error"

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


