import { Item } from "../../../db/index.js";
import { handleRouteErrors } from "../../../utils/error.js";



//! CREATE
//@ Controller per creare un singolo item per ID
// creo un nuovo item che deve rispettare la struttura definita in Item
export const createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);  // Crea un item coi dati passati nel corpo della richiesta (req.body)
    const savedItem = await newItem.save();  // Salva il nuovo prodotto nel database

    res.status(201).json(savedItem); // Risponde con status 201 (creato) e il prodotto salvato in formato JSON
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
/* 
il codice di stato HTTPS "201 Created" è più preciso in questo caso: 
dice al client che un nuovo oggetto è stato creato.
È una buona pratica REST rispettare i codici HTTP corretti, 
perché aiutano chi consuma (utilizza/fa richiesta, 
quindi il client) l’API a capire cosa è successo.


Alcuni codici hanno anche un “reason phrase” (una descrizione testuale standard), ad esempio:
200 OK
201 Created
404 Not Found
500 Internal Server Error
*/



//! READ
//@ Controller per recuperare tutti gli item
// restituisce tutti gli item della collezione associata a Item con i dettagli del prodotto e del punto vendita.
export const getAllItems = async (req, res) => {
  try {
    const allItems = await Item.find()
      //? .find() --> metodo di Mongoose che cerca documenti nella collezione associata al modello
      // Uso Mongoose per cercare nella collezione "items" :
      // Ogni modello (Item, ProductModel, ecc.) è collegato a una collezione MongoDB. 

      .populate({
        path: "product",
        populate: { path: "category" } // Popola anche la categoria dentro product
      })      
      .populate("pointOfSales");  // aggiunge i dettagli del punto vendita

    //? .populate --> metodo di mongoose che recupera i dati dei campi che si riferiscono
    //? ad altri modelli come in questo caso per product e pointOfSales
    // senza .populate apparirebbero solo gli ID dei documenti correlati a quei models, 
    // cioè i dettgli dei riferimenti definiti nello schema (product e pointOfSales)


    // DEBUG: verifica cosa arriva da MongoDB
    console.log("verifica categorie",
      allItems.map(i => ({
        product: i.product?.name,
        category: i.product?.category?.name
      }))
    );


    res.json(allItems); // Risponde(res) al client con un JSON contenente tutti i prodotti
  } catch (error) { // Se c’è un errore risponde con status 500 (errore server)
    console.error(error);
    return handleRouteErrors(res, { error });
  }
};




//@ Controller per recuperare un singolo item per ID
// restituisce un singolo item (cioè un prodotto in un punto vendita specifico) con i dettagli popolati.
export const getItemById = async (req, res) => {
  try {
    const itemById = await Item.findById(req.params.id)
      //? .findById --> metodo di Mongoose che cerca un documento in base al suo ID
      //? proprietà dell'oggetto req che contiene i parametri dinamici dell'url della richiesta ( id in qst caso)
      // il metodo .findById mi trova l'item in base all'ID passato come parametro nell'URL, ma non ha 
      // accesso all'url, quindi .params gli da l'informazione ce gli serve passandogli l'id dell'url.

      .populate("product")
      .populate("pointOfSales");    // Cerca un prodotto in base all’ID passato nell’URL (es. /products/123)

    if (!itemById) return res.status(404).json({ error: "Prodotto non trovato" });
    // Se non lo trova → risponde con errore 404
    res.json(itemById); // risponde con il prodotto in formato JSON

  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};




//! UPDATE
//@ Controller per modificare un item 
export const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,    // ID dell'item da aggiornare
      req.body,        // dati da aggiornare
      { new: true }    // restituisce il documento aggiornato
      //? È un oggetto di opzioni passato come terzo argomento a findByIdAndUpdate.
      // dice: Dopo aver aggiornato il documento, restituiscimi la versione aggiornata, non quella vecchia
      // con false ti restituisce il documento vecchio senza le modifiche
    )

    if (!updatedItem)
      return res.status(404).json({ message: "Item non trovato" });

    // if (!updatedItem) --> Serve per gestire il caso in cui l’item non esiste (buona pratica fondamentale)
    res.json(updatedItem);
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};


//@ Controller per modificare la quantità di un item usando $inc
// AGGIORNA SOLO LO STOCK DI UN ITEM ($inc)

/* $inc è un operatore di MongoDB che incrementa (o decrementa, se passi valore negativo) 
il valore di un campo numerico in modo atomico sulla singola riga del DB. */
export const updateItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantityToAdd } = req.body;

    if (!quantityToAdd || isNaN(quantityToAdd)) {
      return res.status(400).json({ error: "Quantità non valida" });
    }
    
    // Esegui l'update atomico con $inc e restituisci il documento aggiornato
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $inc: { stock: quantityToAdd } },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item non trovato" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Errore server", details: error.message });
  }
};




//! DELITE
//@ Controller per cancellare un item 
export const deliteItem = async (req, res) => {
  try {
    const deliteItem = await Item.findByIdAndDelete(req.params.id)
    //? .findByIdAndDelete --> metodo di Mongoose che trova un documento per ID e lo elimina dalla collezione

    if (!deliteItem) return res.status(404).json({ message: "Item non trovato" });
    res.json({message: "Item eliminato con successo",
      deliteItem}); // restituisce l'item eliminato 
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};


/*
//!Cos’è req?

req significa request → è l’oggetto che contiene tutto ciò che 
il client invia al server.

Dentro req trovi:
req.params → parametri nell’URL
req.body → dati nel corpo della richiesta
req.query → parametri dopo il ? dell’URL
req.headers → info come token, tipo di contenuto, ecc.


//!In questo caso:

tu passi req.body a Mongoose
Mongoose verifica che i campi coincidano con il tuo schema
se qualcosa manca → errore
se qualcosa è in più → Mongoose decide se ignorarlo o generare errore (a seconda delle impostazioni)

 req.body:
È il pacchetto di dati grezzi spedito dal client.
Express lo mette in req.body per permetterti di lavorarci.

//!il “controllo modello”:
Lo fanno Mongoose o un middleware di validazione 
 (es. Zod, Yup, Joi… oppure Express Validator).

*/