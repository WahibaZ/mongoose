require('dotenv').config();
const mongoose = require('mongoose');
const Person = require('./person'); 

async function connectDatabase() {
  

    const uri = process.env.MONGO_URI; // URI de connexion à la base de données
    if (!uri) {
        console.error('MONGO_URI is not defined in .env');
        process.exit(1); 
    }

    try {
        // Connexion à MongoDB
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        // Gestion des erreurs de connexion
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
    }
}

async function add() {
    try {
        
        const arrayOfPeople = [
            { name: 'Am', age: 33, favoriteFoods: ['burritos', 'Burger'] },
            { name: 'amilcar', age: 25, favoriteFoods: ['burritos', 'chocolat'] },
            { name: 'maria', age: 32, favoriteFoods: ['pizza', 'burritos'] }
        ];

        // Ajouter les personnes en utilisant la méthode create
        const people = await Person.create(arrayOfPeople);
        console.log('People created successfully:', people);
    } catch (error) {
        
        console.error('Error inserting data:', error);
    }
}

async function findByName(name) {
    try {
        const people = await Person.find({ name: name });
        console.log('People found:', people);
    } catch (error) {
        console.error('Error finding people:', error);
    }
}

async function findByFood(food){
try{
    const person = await Person.findOne({  favoriteFoods: { $in: [food] } }).exec();
    console.log('Person found with favorite food:', person);
}catch(error){
    console.error('error finding by food', error);
}
}

async function findPersonById(personId){
    try{
        const per = await Person.findById(personId);
        console.log('Person found by ID:', per);
    }catch(error){
        console.error('error finding person by id', error)
        
    }
}
 async function advancedUpdate(personId){
    try{
        const person= await Person.findById(personId);
        if (person){
            person.favoriteFoods.push('hamburger');
            await person.save();
            console.log('Person updated successfully:', person);
        } else {
            console.log('Person not found');
        }

    }catch(error){console.error('error updationg person',error)}
 }

 async function performedUpdate(personName){
    try{
        const result=await Person.findOneAndUpdate(
            { name: personName },
            { age: 20 },
            { new: true } // Retourne le document mis à jour
        );
        if (result) {
            console.log('Person updated successfully:',result)
        } else {
            console.log('Person not found');
        }

    }catch(error){console.error('error updating', error)}
 }

 async function deletePersonById(personId) {
    try {
        const removedPerson = await Person.findOneAndDelete(personId);
        if (removedPerson) {
            console.log('Person removed successfully:', removedPerson);
        } else {
            console.log('Person not found');
        }
    } catch (error) {
        console.error('Error removing person:', error);
    }
}

async function deletePeopleByName(name) {
    try {
        const result = await Person.deleteMany({ name: name });
        console.log(`Number of documents deleted: ${result.deletedCount}`);
    } catch (error) {
        console.error('Error removing people:', error);
    }
}

async function findPeople() {
    try {
        const people = await Person.find({ favoriteFoods: 'burritos' })
            .sort({ name: 1 }) // Trier par nom en ordre croissant
            .limit(2) // Limiter les résultats à 2 documents
            .select('-age') 
            .exec(); // Exécuter la requête

        console.log('People found:', people);
    } catch (error) {
        console.error('Error finding people:', error);
    }
}
async function main() {
    await connectDatabase();
   // await add();
    /*await findByName('Asma'); */
    //await findByFood('couscous');
    //await findPersonById('66a0da61352397781ee36734');
    //await advancedUpdate('66a0da61352397781ee36734');
    //await performedUpdate('monNom');
    //await deletePersonById('66a0da61352397781ee36734');
   // await deletePeopleByName('asma');
  await findPeople();
    mongoose.connection.close(); 
}

main();
