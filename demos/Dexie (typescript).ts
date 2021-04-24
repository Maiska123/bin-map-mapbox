import Dexie from 'dexie';

interface Friend {
    id?: number;
    name?: string;
    age?: number;
}

//
// Declare Database
//
class FriendDatabase extends Dexie {
    public friends: Dexie.Table<Friend, number>; // id is number in this case

    public constructor() {
        super("FriendDatabase");
        this.version(1).stores({
            friends: "++id,name,age"
        });
        this.friends = this.table("friends");
    }
}

const db = new FriendDatabase();

db.transaction('rw', db.friends, async() => {

    // Make sure we have something in DB:
    if ((await db.friends.where({name: 'Josephine'}).count()) === 0) {
        const id = await db.friends.add({name: "Josephine", age: 21});
        alert (`Addded friend with id ${id}`);
    }

    // Query:
    const youngFriends = await db.friends.where("age").below(25).toArray();

    // Show result:
    alert ("My young friends: " + JSON.stringify(youngFriends));

}).catch(e => {
    alert(e.stack || e);
});
