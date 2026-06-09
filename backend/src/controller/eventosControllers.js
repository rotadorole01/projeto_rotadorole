const myModel = require("../model/eventosModel.js")

async function Get(req,res){
     const responseData = await myModel.Get(req);
     return responseData;
}

async function GetById(req,res){
  const id = req.params.id;
  const responseData = await myModel.GetById(id);
  return responseData;
}

function Post(req,res){
  const payload = req.body;
  const responseData = myModel.Post(payload);
  return responseData;
   
}

function Put(req,res){
  const id = req.params.id;
  const payload = req.body;
  const responseData = myModel.Put(payload , id);
  return responseData;
   
}

function Delete(req,res){
  const id = req.params.id;
  const responseData = myModel.Delete(id);
  return responseData;
}

function EndPointName(){
  return myModel.EndPointName();
}

module.exports = { Get, GetById, Post, Put, Delete , EndPointName}