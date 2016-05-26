/* TOKEN_TYPE is an object dat contains all types of TOKENS that can 
 * be consumed in the lexer analysis.
 */
var TOKEN_TYPE = {
  ID:           'ID',
  L_BRACK:      'L_BRACK',
  R_BRACK:      'R_BRACK',
  L_SQR_BRACK:  'L_SQR_BRACK',
  R_SQR_BRACK:  'R_SQR_BRACK',
  EQUAL:        'EQUAL',
  END:          'EOF',
  EMPTY:        'ε',
  SEMICOLON:    'SEMICOLON',
  COMMA:        'COMMA',
  HTML_L_BRACK: 'HTML_L_BRACK',
  HTML_R_BRACK: 'HTML_R_BRACK',
  QUOTE:        'QUOTE',
  STRICT:       'STRICT',         /////
  SUBGRAPH:     'SUBGRAPH',       /////
  GRAPH:        'GRAPH',          /////    RESERVED
  DIGRAPH:      'DIGRAPH',        /////    WORDS
  NODE:         'NODE',           /////     
  EDGE:         'EDGE',           /////
  EDGEOP:       'EDGEOP'          /////
};

/* isDotID is a function that receive a char as input and
 * returns TRUE if the character is an valid ID otherwise 
 * returns FALSE.
 *  
 * regChar char
 * return  bool
 */
function isDotID(regChar) {
  return (regChar >= 'a'    && regChar <= 'z')    || //char
         (regChar >= 'A'    && regChar <= 'Z')    || //char
         (regChar >= '\200' && regChar <= '\377') || //char
         (regChar >= '0' && regChar <= '9')       || //digit
          regChar == '_';  //special char
}

function Lexer_Error(message){
  return new Error({'type': 'Lexer_Error', 'message': message});
}

/* Token is a function that construct a TOKEN object
 *  
 * type  TOKEN_TYPE
 * text  String
 */
function Token(type, text) {
  this.type = type;
  this.text = text;
}

/* Lexer is a function that receive a String as input and
 * construct  a Lexer object. Is  initialize the index of 
 * the analyser.
 *  
 * regString String
 */
function Lexer(regString) {
  var barSTR = '========================================================';  /////
  console.log(barSTR);                                                      /////    Temporary 
  console.log('INPUT CODE TO PARSE:\n\n' + regString);                      /////
  console.log('\n'+ barSTR +'\n');                                          /////     displays
                                                                            /////
  this.regString = regString;                           
  this.index = 0;                                                           
};

/* hasNext is a function of the Lexer that verify if  the
 * current Lexer index is lower than the regString length.
 *  
 * return boolean
 */
Lexer.prototype.hasNext = function() {
  if (this.regString)
    return this.index < this.regString.length;
  return false;
}


/* nextToken  is a  function  of the Lexer  that identify the 
 * next Token  in the  regString. The  function  consume  the
 * next character  of  the regString  and verify if this char
 * belongs to  the  alphabet or if is the start of a reserved
 * word or ID (in this cases consume more than one character)
 *  
 * return Token
 */
Lexer.prototype.nextToken = function() {
  if (this.hasNext()) {

    if(this.regString[this.index] == ' '  || this.regString[this.index] == '\n' || 
       this.regString[this.index] == '\t' || this.regString[this.index] == '\r' ||
       this.regString[this.index] == '\\' || this.regString[this.index] == '\w'){
        
        ++this.index;
        return null;
    }

    switch (this.regString[this.index]) {
      case 'd':
        return this.generateReservedToken(TOKEN_TYPE.DIGRAPH, 'digraph');
      case 'e':
        return this.generateReservedToken(TOKEN_TYPE.EDGE, 'edge');
      case 'g':
        return this.generateReservedToken(TOKEN_TYPE.GRAPH, 'graph');
      case 'n':
        return this.generateReservedToken(TOKEN_TYPE.NODE, 'node');
      case 's':
        return this.generateReservedToken(TOKEN_TYPE.STRICT, 'strict');
      case '-':
        return this.generateReservedToken(TOKEN_TYPE.EDGEOP, '->');
      case 'ε':
        return this.generateToken(TOKEN_TYPE.ID, 'ε');
      case '<':
        return this.generateToken(TOKEN_TYPE.HTML_L_BRACK, '<');
      case '>':
        return this.generateToken(TOKEN_TYPE.HTML_R_BRACK, '>');
      case '{':
        return this.generateToken(TOKEN_TYPE.L_BRACK, '{');
      case '}':
        return this.generateToken(TOKEN_TYPE.R_BRACK, '}');
      case '[':
        return this.generateToken(TOKEN_TYPE.L_SQR_BRACK, '[');
      case ']':
        return this.generateToken(TOKEN_TYPE.R_SQR_BRACK, ']');
      case '=':
        return this.generateToken(TOKEN_TYPE.EQUAL, '=');
      case ';':
        return this.generateToken(TOKEN_TYPE.SEMICOLON, ';');
      case ',':
        return this.generateToken(TOKEN_TYPE.COMMA, ',');
      case '"':
        return this.generateToken(TOKEN_TYPE.QUOTE, '"');
      default:
        if(isDotID(this.regString[this.index]))
          return this.generateIDToken();
        else
          throw Lexer_Error('*LEXER ERROR*\n'
            +'Lexer get an unknown character as input \'' + this.regString[this.index] + '\'');
   }
 }
 else
  return "There's no TOKENS to consume.";
}


/* generateToken is a function of the  Lexer that receive
 * as input a TOKEN_TYPE and a String with the content of
 * the token. The inputs are used to generate a Token and 
 * the Lexer.index is incremented.
 *  
 * TOKEN_TYPE TOKEN_TYPE
 * token      String
 * 
 * return     Token
 */
Lexer.prototype.generateToken = function(TOKEN_TYPE, token){
    ++this.index;
    return new Token(TOKEN_TYPE, token);
}

/* generateReservedToken is a function of the Lexer that 
 * receive as  input a TOKEN_TYPE and a  String with the 
 * content of the token. The  function  analyse the next
 * characters of the regString based in the token.length,
 * by comparing the String between the index and index +
 * + token.lenght with token content. If  match is a re-
 * served TOKEN otherwise can be an ID TOKEN. In case of
 * a reserved TOKEN the Lexer.index  is incremented with 
 * the input token lenght.
 *  
 * TOKEN_TYPE TOKEN_TYPE
 * token      String
 * 
 * return     Token
 */
Lexer.prototype.generateReservedToken = function(TOKEN_TYPE, token){
  if (this.hasNext() && this.regString[this.index+(token.length-1)] != null) {
    var _temp_str = this.regString.substring(this.index, this.index+token.length);
    
    if(_temp_str === token && !isDotID(this.regString[this.index+token.length])){
      this._consume(token.length);
      return new Token(TOKEN_TYPE, token);
    }
    else
      if(_temp_str === token && !isDotID(this.regString[this.index+(token.length-1)])){
      this._consume(token.length);
      return new Token(TOKEN_TYPE, token);
    }
    else
      return this.generateIDToken();
  }
} 
 
/* generateIDToken  is a function of the  Lexer that 
 * iterate for the next  characters in regString, if
 * Lexer.hasNext(), and stop when  find a  character 
 * tha don't belong to the ID character set. In each
 * iteration the Lexer.index is incremented.
 * 
 * return     Token
 */
Lexer.prototype.generateIDToken = function(){
  var _temp = '';
      
  while(this.hasNext()){
    if(isDotID(this.regString[this.index])){
      _temp = _temp + this.regString[this.index];
      ++this.index;
    }
    else
      break;
  }
  return new Token(TOKEN_TYPE.ID, _temp);
}

/* _consume is a  function of the Lexer that  receive as  
 * input an  Unsigned Integer that represent the  number 
 * of increments. The Lexer.index is incremented n times.
 *  
 * n      Unsigned Integer
 */
Lexer.prototype._consume = function(n) {
  return this.index+= n;
}

module.exports.Lexer = Lexer;
module.exports.TOKEN_TYPE = TOKEN_TYPE;