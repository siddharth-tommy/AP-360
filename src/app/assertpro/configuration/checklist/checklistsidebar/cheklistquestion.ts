export class QuestionsList {
    Name:string=''
    Answer1="";
    Answer2="";
    Answer3="";
    Answer4="";
    ExpAnswer;
    correctAnswer;
    answer3show:boolean=false;
    answer4show:boolean=false;
    ID:null;
    MiniCheckList=null;
    Action=null;
    constructor(values: Object = {}) { 
        Object.assign(this, values);
    }
}