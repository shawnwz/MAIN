/**
 * @class app.gui.controls.HeroesList
 */

app.gui.controls.HeroesList = function HeroesList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HeroesList, app.gui.controls.HtmlFocusList);

app.gui.controls.HeroesList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    /*
        <app-heroes-list id="jumpListHome" class="jumpoff-list" data-orientation="horizontal" data-feature="home">
            <template>
                <app-heroes-list-item class="heroes-item"></app-heroes-list-item>
            </template>
        </app-heroes-list>
    */
    this.itemTemplate = "app-heroes-list-item";
    this.className = "heroes-list";

    this.animate = true;
    this.orientation = "Horizontal";
    this._wrapped = false;

    this._minItemNb = 3;
    this._maxItemNb = 3;

    this.logExit();
};

app.gui.controls.HeroesList.prototype._fetch = function _fetch (/* node */) {
    this.logEntry();
    this.superCall();

    var me = this,
        heroes = [
            "Jason", "Bruce", "Peter", "Johnny", "Tyler", "Paul", "Don", "Harvey", "David", "Steve", "Gil", "Dale", "Robert",
            "Rick", "Jonathan", "Kurt", "Martin", "Rob", "Frank", "Michael", "George", "Jeff", "Jack", "Lloyd", "Michael",
            "Brian", "Denis", "Danny", "Sam", "Brad", "Joss", "Angry", "Gabriel", "Peter", "David", "Luke", "Oscar", "Edward",
            "David", "Phillip", "Bert", "Helmut", "Snowy", "Simon", "Dougie", "Jeremy", "Vincent", "Eric", "Don", "Ray", "Tony",
            "John", "Bruce", "Manu", "Dick", "Josef", "George", "Billy", "Jonathan", "Roy", "Nicholas", "Steve", "Wayne", "Jon",
            "Ian", "Graeme", "Matt", "Tony", "Nicholas", "Grant", "Derek", "Luke", "Beau", "John", "Robert", "Kenneth", "Frank",
            "Laurence", "Ben", "Tony", "Lyall", "Alex", "Bille", "Bryan", "John", "Robert", "Alexander", "Michael", "Scott",
            "Simon", "Tom", "Glenn", "Mitchell", "Nathaniel", "Christian", "Dallas", "Jeremy", "Terry", "Jack", "Alexander",
            "Paul", "Rob", "Luke", "Peter", "Richard", "William", "Alan", "Michael", "Nathan", "Richard", "Jeremy", "Charles",
            "Jack", "Khan", "Jason", "Bob", "Paul", "Christian", "Ryan", "Jason", "John", "Adam", "Salvatore", "Vince", "Mark",
            "James", "Fred", "Clyde", "Harry", "Tyler", "Martin", "Ryan", "Rick", "Jai", "Brendan", "Martin", "Barry", "Don",
            "Russell", "Max", "Andrew", "Bernard", "Stephen", "Allan", "Daniel", "Kieran", "David", "Matt", "Slim", "André",
            "Nathaniel", "Sydney", "Paul", "John", "Ed", "Arthur", "Alex", "Martin", "Ernie", "Firass", "Anh", "Grant", "Felino",
            "Matt", "Christopher", "Barry", "Gerry", "David", "Russell", "Joel", "George", "Christopher", "Joff", "Alexander",
            "Jon", "Fred", "Reg", "John", "Neil", "Keegan", "Eamon", "Lindsay", "Willie", "Mark", "Cody", "John", "Lewis", "David",
            "Gary", "Travis", "Peter", "Stewart", "Jon", "Jack", "Peter", "Lewis", "John", "Flea", "Ian", "Errol", "Craig", "Leon",
            "Luke", "James", "Abe", "Drew", "Bren", "Damien", "Frank", "David", "John", "James", "Damien", "William", "Colin",
            "Alfred", "John", "Frank", "Damon", "Jason", "Adam", "Damien", "Frank", "Dean"
        ],
        hero = heroes[Math.floor(Math.random() * heroes.length)];

    this.fireControlEvent("clear");

    $service.DISCO.Search.search(hero, "searchFilterPEOPLE").then(function(data) {
        me.fireControlEvent("populate", data);
    });

    this.logExit();
};

/**
 * @class app.gui.controls.HeroesListItem
 */

app.gui.controls.HeroesListItem = function HeroesListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.HeroesListItem, app.gui.controls.HtmlListItem);

app.gui.controls.HeroesListItem.prototype.createdCallback = function createdCallback() {
    this.logEntry();
    this.superCall();
    this.className = "heroes-item";
    this._data = {};
    this.logExit();
};

Object.defineProperty(app.gui.controls.HeroesListItem.prototype, "itemData", {
    get: function get() {
        return this._data;
    },
    set: function set(data) {
        this._data = data;
        var html = "";

        html += '<div class="tileShadow"></div>';
        html += '<div class="tileGradient"></div>';
        this.innerHTML = html;

        if (data) {
            this.style.backgroundImage = "url('" + data.promo + "')";
        } else {
            //this.textContent = "hero #"+this.itemIndex;
        }
    }
});
