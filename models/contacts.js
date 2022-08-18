const fs = require ('fs');
const FsPromises = fs.promises;
const path = require('path');

const contactsPath = path.join(__dirname, './contacts.json');

const changeListContacts = async(list) => {
  return await FsPromises.writeFile(contactsPath,JSON.stringify(list),"utf-8")
}

const listContacts = async () => {
  const list = await FsPromises.readFile(contactsPath,"utf-8")
    return JSON.parse(list);
}

const getContactById = async (contactId) => {
  const list = await listContacts();
  const result = list.find(r => r.id == contactId);
  return result || null;
}

const removeContact = async (contactId) => {
  const list = await listContacts();
  const i = list.findIndex(r => r.id == contactId);
  if (i === -1){
    return null
  }
  const remove = list.splice(i,1);
  await changeListContacts(list); 
  return true;
}

const addContact = async (body) => {
  const list = await listContacts();
        const id = list.reduce((acc,num)=> acc>Number(num.id)?acc:acc=Number(num.id),0)
        const newArray = {id: `${id+1}`, ...body};
       await changeListContacts([...list, newArray]); 
      //  const result = await readListContacts();
       return newArray;
}

const updateContact = async (contactId, body) => {

  const list = await listContacts();
  const item = list.find(r => r.id == contactId);
  const i = list.findIndex(r => r.id == contactId);
  if (!item){
    return false;
  }
  const update = {...item,...body};
  list[i] = update;
  await changeListContacts(list); 
  return update;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
