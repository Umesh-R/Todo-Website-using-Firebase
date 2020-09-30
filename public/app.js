particlesJS.load('particles-js', 'particlesjs-config.json');



// trash icon
const trash='<svg  width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash trash-icon" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';




const whenSignedOut = document.getElementById('whenSignedOut');
const whenSignedIn = document.getElementById('whenSignedIn');


const userDetails = document.getElementById('userDetails');

const addTaskForm=document.querySelector('#addTask');

const dateForm=document.querySelector("#dateForm");

const todoList=document.getElementById('todoList');

const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

const db= firebase.firestore();

var thingsRef;
var unsubscribe;
var d;
var lastIdNo=null;


function signIn(){
    auth.signInWithPopup(provider);
}

function signOut(){
    auth.signOut();
}

function initialiseThingsRef(user)
{
    if (d==null){
        d= new Date()
        d=d.getDate()+'.'+(d.getMonth()+1)+'.'+d.getFullYear();
    }
    showDate(d);
    // console.log(d)
    thingsRef=db.collection('things').doc(user.email).collection(d);
    thingsRef.doc().get().then((docSnapshot)=>
    {
        if(!docSnapshot)
        {
            thingsRef.doc.set(
                {
                    task:'itemToAdd'
                }
            );
        }
    });
    //console.log(thingsRef)
}

function showDate(d){
    const dateDiv= document.querySelector('#Date');
    txt=d.substring(0,2)+"/";
    for(i=3;d[i]!='.';i++)
    {
        txt+=d[i];
    }
    dateDiv.innerHTML=txt;
}

function addTask(e)
{
    e.preventDefault();
    var val=addTaskForm.task.value.trim();
    console.log('number=',lastIdNo);
    if (val != '' && lastIdNo!=null)
    {
        const { serverTimestamp } = firebase.firestore.FieldValue;
        lastIdNo= lastIdNo+1;
        thingsRef.doc('item-' + lastIdNo).set({
            task: val,
            done: 'false',
            createdAt: serverTimestamp()
        });
        addTaskForm.task.value=""; 
        }
        else if(lastIdNo==null)
        {
            console.log('Number of elements not updated.');
        }
}

async function updateTasks()
{
    unsubscribe = await thingsRef.onSnapshot(async (querySnapshot) =>{
        var itemList=[];
        txt='';
        if (lastIdNo==null){
            let promise= await thingsRef.orderBy("createdAt", "desc").limit(1).get().then(querySnapshot => {
            if (!querySnapshot.empty) {
                //We know there is one doc in the querySnapshot
                const queryDocumentSnapshot = querySnapshot.docs[0];
                // console.log('inside number finder')
                // console.log(queryDocumentSnapshot)
                 console.log("Document data:", queryDocumentSnapshot.data());
                var n=queryDocumentSnapshot.id;
                //console.log('id=',n);
                lastIdNo=parseInt(n.split('-')[1]);
            } else 
            {   
                console.log("No document corresponding to the query!");
                lastIdNo=0;
            }
            });
            console.log('Last ID Number',lastIdNo)
        }
        querySnapshot.forEach(function(doc) {
            if (doc.data().done=="false"){
                itemList.push(`<li id="${doc.id}" onclick="taskDone(this.id)" class=\"item\"><a class="text-break" href=\"#\">${doc.data().task}</a> <button class="item-delete" onclick="deleteItem(this.parentNode.id)">${trash}</button></li>`);
            }
            else{
                itemList.push(`<li id="${doc.id}" onclick="taskDone(this.id)" class=\"done item\"><a class="text-break" href=\"#\">${doc.data().task}</a> <button class="item-delete" onclick="deleteItem(this.parentNode.id)">${trash}</button></li>`);
            }    
        });
        
        itemList.forEach(element => {
                txt+=element;
        });
        todoList.innerHTML = txt;
    });
    
}    

function deleteItem(id){
    
    thingsRef.doc(id).delete();
    //console.log(id);
    const i=document.getElementById(id);
    i.parentNode.removeChild(i);

}

function taskDone(id)
{
    const i= document.getElementById(id);
    //console.log(id);
    if (i!=null){
        thingsRef.doc(id).get().then(snap=>{
            if (snap.data().done=="false"){
                thingsRef.doc(id).update({
                    "done":"true"
                });
            }
            else{
                thingsRef.doc(id).update({
                    "done":"false"
                });
            }
        });
    
        i.classList.add("done");
    }
    
}

function showCalendar()
{
    
    if (dateForm.style.visibility=="hidden")
    {
        dateForm.style.visibility = "visible";
    }
    else{
        dateForm.style.visibility = "hidden";
    }
}

function changeDate(e)
{
    e.preventDefault();
    var val= dateForm.date.value.trim();
    //console.log(val);
    if (val.search(/[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]/i) != -1){
        //console.log('update date',val);
        d=val.replace(/\//g,".");
        if(d[3]=='0'){
            d=d.substring(0,3)+d.substring(4,10);
        }
        console.log(d);
    }
    else{
        console.log('Invalid input to change date');
    }
    dateForm.date.value='';

}




auth.onAuthStateChanged((user)=>{
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = user.displayName;
        initialiseThingsRef(user);
        addTaskForm.addEventListener('submit',addTask);
        dateForm.addEventListener('submit',(e)=>{
            changeDate(e);
            initialiseThingsRef(user);
            updateTasks();
        });
        updateTasks();
        
    
        
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});






