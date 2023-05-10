
class Bookmarker {
    constructor() {

        this.apiUrl = 'https://opengraph.io/api/1.1/site'; 
        this.appId = '7c4dfe76-d3ab-41fd-81d4-3f4dd2e94794';
        try { this.bookmarks = JSON.parse(localStorage["bookmarks"]) }
        catch {
            this.bookmarks =
            [
                {
                    description: "Really cool site for open source photos",
                    image: "",
                    link: "https://www.pexels.com/",
                    title: "https://www.pexels.com/"
                },

                {
                    description: "Just the Google search engine",
                    image: "",
                    link: "https://www.google.com/?client=safari",
                    title: "https://www.google.com/?client=safari",
                }
            ]
        }

        this.addBookmark = this.addBookmark.bind(this);

        document.getElementById("form").onsubmit = this.addBookmark;
        this.addEventHandlers = this.addEventHandlers.bind(this);
        this.fillBookmarks();



    }

    addBookmark(event) {
        event.preventDefault();
        const url = document.getElementById("url");
        const description = document.getElementById("description");

        const urlValue = url.value;
        const descriptionValue = description.value;
        const encodedUrl = encodeURIComponent(urlValue);

        if(urlValue && descriptionValue == "")
        {
          url.classList.add("is-invalid");
          description.classList.add("is-invalid");
        }
    
        else{
            fetch(`${this.apiUrl}/${encodedUrl}?app_id=${this.appId}`) 
            .then (response => response.json())
            .then (data => { 
                const newBookmark = {
                title: data.hybridGraph.title,
                description: descriptionValue,
                image: data.hybridGraph.image,
                link: urlValue,}
                url.classList.remove("is-invalid");
                description.classList.remove("is-invalid");
                this.bookmarks.push(newBookmark);
                this.fillBookmarks();
          
                url.value = "";
                description.value = "";
            });
        }
        
    }

    addEventHandlers() {
        let deleteIcons = document.getElementsByName("deleteBookmark");
    
       
        for (let i = 0; i < deleteIcons.length; i++) {
          deleteIcons[i].onclick = this.deleteBookmark.bind(this, i);
        }
    }

    fillBookmarks() {
        localStorage["bookmarks"] = JSON.stringify(this.bookmarks);

       // let tasksHtml = "";
        //for (let i = 0; i < this.tasks.length; i++) {
            //tasksHtml += this.generateBookmarkHtml(this.tasks[i], i);
       // }
        let bookmarkHtml = this.bookmarks.reduce(
            (html, bookmark, index) => html += this.generateBookmarkHtml(bookmark, index), 
            '');

            document.getElementById("bookmarksList").innerHTML = bookmarkHtml;
            this.addEventHandlers();
    }

    generateBookmarkHtml(bookmark) {
        return `<div class="bookmarks-list content">
        <a href="${bookmark.link}" target="_blank" class="bookmark">
            <div class="img" style="background-image:url('${bookmark.image}')">&nbsp;</div>
            <div class="title">${bookmark.title}<br>
                ${bookmark.description}
            </div>
            <div><i name="deleteBookmark" class="bi-trash delete-icon"></i></div>
        </a>
    </div>`

    }

    deleteBookmark(index, event) {
        event.preventDefault();
        this.bookmarks.splice(index, 1);
        this.fillBookmarks();

    }
}

let bookmarker;
window.onload = () => { bookmarker = new Bookmarker() };