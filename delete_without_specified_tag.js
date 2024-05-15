// Select all items you want to search through
// This will delete all items that do not have the specified tag

// Define the name of the tag to check for
const tagName = "YourTagName"; // Replace "YourTagName" with the name of your tag

// Create a new search object
var search = new Zotero.Search();

// Set the library ID to the selected library
search.libraryID = ZoteroPane.getSelectedLibraryID();

// Search for the items that have the tag
search.addCondition('tag', 'is', tagName);
var itemIDs = await search.search();

// Get the selected items
const selectedItems = ZoteroPane.getSelectedItems();

// Filter selected items to keep only those found in the search result
const itemsToKeep = selectedItems.filter(item => itemIDs.includes(item.id));

// Delete items that were not found in the search result
const itemsToDelete = selectedItems.filter(item => !itemsToKeep.includes(item));
for (const item of itemsToDelete) {
    item.deleted = true;
    await item.saveTx();
}

console.log("Number of items deleted:", itemsToDelete.length);

return itemsToDelete;
