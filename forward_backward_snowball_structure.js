// Select Parent Collection and get children
var currentCollection = ZoteroPane.getSelectedCollection();
var items = currentCollection.getChildItems();

// Use title as SubCol name
var mainCollections = Promise.all(items.map(async item => {
    var title = item.getField('title');

    // Create the main collection for the title
    var collection = new Zotero.Collection();
    collection.name = title;
    collection.parentID = currentCollection.id;
    var collectionID = await collection.saveTx();

    // Add the item to main collection
    await Zotero.Collections.get(collectionID).addItem(item.id);

    // Create "Backward (Citations)" subcollection inside main collection
    var backwardCollection = new Zotero.Collection();
    backwardCollection.name = "Backward (Citations)";
    backwardCollection.parentID = collectionID;
    await backwardCollection.saveTx();

    // Create "Forward (Cited in)" subcollection inside main collection
    var forwardCollection = new Zotero.Collection();
    forwardCollection.name = "Forward (Cited in)";
    forwardCollection.parentID = collectionID;
    await forwardCollection.saveTx();

    return collectionID;
}));

return mainCollections;

// Run this in Zotero application Tools > Developer > Run Javascript
// This script is useful for automating the creation of a directory for Forward/Backward Snowballing
// This script will create the following directory:
// # Some Parent Collection - this will hold your articles
// ## ArticleName1
// ### Backward (Citations)
// ### Forward (Cited In)
// ## ArticleName...n
// ### Backward (Citations)
// ### Forward (Cited In)