import { v2 as cloudinary } from 'cloudinary'
import AppError from '../errors/appError'
import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import fs from 'fs'
import { env } from '../config/env'

// Configuration
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_SECRET,
})

// TODO: Need to transform img
export const uploadImgToCloudinary = async (
    fileName: string,
    filePath: string,
) => {
    let res
    try {
        res = await cloudinary.uploader.upload(filePath, {
            public_id: fileName,
        })
    } catch (error: any) {
        // Clean up the local file even on failure
        fs.unlink(filePath, () => { })

        console.error('Cloudinary upload error:', error)

        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            error?.message || error?.error?.message || 'Error uploading image to cloudinary',
        )
    }

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error removing file: ${err}`)
            return
        }
        console.log(`File ${filePath} has been successfully removed.`)
    })

    return res
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    },
})

export const upload = multer({ storage: storage })
