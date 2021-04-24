import Dexie from 'dexie';
import 'dexie-observable';

// Use Dexie as normally - but you can also subscribe to db.on('changes').

// Usage with existing DB
// In case you want to use Dexie.Observable with your existing database, you will have to do a schema upgrade.
// Without it Dexie.Observable will not be able to properly work.

var db = new Dexie('myExistingDb');
db.version(1).stores(/*... existing schema ...*/);

// Now, add another version, just to trigger an upgrade for Dexie.Observable
db.version(2).stores({}); // No need to add / remove tables. This is just to allow the addon to install its tables.
