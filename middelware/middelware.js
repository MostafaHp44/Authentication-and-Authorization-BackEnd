const uservalid =require('../Valid/Validator')

module.exports=(req,res,nxt)=>{
    
    let uservalidator=uservalid(req.body)

    if (uservalidator){
        req.uservalidator=1
        nxt();
    }
    else{
        res.status(403).send('for bidden command')
    }
}
