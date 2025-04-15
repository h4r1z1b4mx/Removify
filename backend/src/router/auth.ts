import { Router } from "express";
import {signInSchema, signUpSchema } from "../types";

import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { prisma } from "../db";

const router = Router();
router.post('/register', async (req:any,res:any)=>{
    const body = req.body;

    const parsedBody = signUpSchema.safeParse(body);

    if(!parsedBody.success){
        return res.status(400).json({
            msg:"Invalid body",
        })
    }

    const {firstName,lastName,email,password} = parsedBody.data;

    const userExists = await prisma.user.findFirst({
        where:{
            email:email
        }
    });

    if(userExists){
        return res.status(400).json({
            msg:"User already exists",
        })
    }

    const user = await prisma.user.create({
        data:{
            firstname:firstName,
            lastname:lastName,
            email:email,
            password:password
        }
    })
    return res.status(200).json({
        msg:"User created successfully",
    })
});

router.post('/login', async(req:any,res:any)=>{
    const body = req.body;
    const parsedBody = signInSchema.safeParse(body)

    if(!parsedBody.success){
        return res.status(404).json({
            msg:"Invalid Body"
        });
    }
    
    const {email,password} = parsedBody.data;

    const user = await prisma.user.findFirst({
        where:{
            email,
            password
        }
    })

    if(!user){
        return res.status(404).json({
            "msg":"Credential Invalid"
        });
    }

    const token = jwt.sign({
        id:user.id
    },JWT_PASSWORD);
    
    return res.json({
        token
    });

});


router.get('/', async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const user = await prisma.user.findFirst({
        where:{
            id
        },select:{
            firstname:true,
            lastname:true,
            email:true
        }
    });
    res.json({
        user
    });
});


export const authRouter = router;