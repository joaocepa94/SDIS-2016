var Lexer = require('./lexer').Lexer;
var TOKEN_TYPE = require('./lexer').TOKEN_TYPE;

/*
 * DOT GRAMMAR
 *
 *  The following is  an abstract grammar  deﬁning the DOT language. Terminals are 
 *  shown in bold font and nonterminals in  italics. Literal characters  are given 
 *  in single  quotes. Parentheses ( and ) indicate  grouping  when needed. Square 
 *  brackets [ and ] enclose optional items. Vertical bars | separate alternatives.
 *
 *
 * 
 *  graph : [ strict ] (graph | digraph) [ ID ] ’{’ stmt_list ’}’         **DONE**
 *  stmt_list : [ stmt [ ’; ’ ] stmt_list ] 							  **DONE**
 *  stmt : node_stmt | edge_stmt | attr_stmt | ID ’=’ ID | subgraph       **DONE**
 *  attr_stmt : (graph | node | edge) attr_list                           **DONE**
 *  attr_list : ’[ ’ [ a_list ] ’] ’ [ attr_list ]                        **DONE**
 *  a_list : ID ’=’ ID [ ( ’; ’ | ’ , ’) ] [ a_list ]                     **DONE**
 *  edge_stmt : (node_id | subgraph) edgeRHS [ attr_list ]                **DONE**
 *  edgeRHS : edgeop (node_id | subgraph) [ edgeRHS ]                     **DONE**
 *  node_stmt : node_id [ attr_list ]                                     **DONE**
 *  node_id : ID [ port ] 												  **DONE**
 *  port : ’: ’ ID [ ’: ’ compass_pt ] | ’: ’ compass_pt             **NOT IMPLEMENTED**
 *  subgraph : [ subgraph [ ID ] ] ’{’ stmt_list ’}’                 **NOT IMPLEMENTED**
 *  compass_pt : (n | ne | e | se | s | sw | w | nw | c | _)         **NOT IMPLEMENTED**
 *
 */

function Parser() {
   this.grammar_index = 0;  
   this.displayRunningTimeInfo =  true;   

   this.TOKEN_ARRAY = [];           
   this.TOKENS_DIVERSITY = [];                            
};

function Parse_Error(message){
	return new Error(message);
}


Parser.prototype._graph = function() { // graph : [ strict ] (graph | digraph) [ ID ] ’{’ stmt_list ’}’  **DONE**

	// [ strict ]         (optative)
	this._checkToken(TOKEN_TYPE.STRICT, {optative: true, error_message: ""}); 

	// (graph | digraph)  Verifies the existence of one of the two primitives.
	this._checkToken2(TOKEN_TYPE.GRAPH , TOKEN_TYPE.DIGRAPH, {optative: false, error_message: "\nThe graph or digraph primitive is missing."}); 

	// [ ID ]             (optative)
	this._checkID(true);

	// ’{’                Verifies the existence of a L_BRACK
	this._checkToken(TOKEN_TYPE.L_BRACK, {optative: false, error_message: "\nThe \'{\' primitive is missing."}); 

	/* 
	 * Process the statement list (stmt_list) TOKENS
	 */
	
		this._stmt_list();


	// ’}’                Verifies the existence of a R_BRACK
	this._checkToken(TOKEN_TYPE.R_BRACK, {optative: false, error_message: "\nThe \'}\' primitive is missing."}); 

	if(this.displayRunningTimeInfo)
		console.log("\n**SUCCESS**\nDOT script code was sucessfuly parsed!");
}

Parser.prototype._stmt_list = function() { // stmt_list : [ stmt [ ’; ’ ] stmt_list ]  **DONE**

		/* 
	 	 * Process the statement (stmt) TOKENS
		 */
	
			this._stmt();

		// [ ’; ’ ]           (optative)
		this._checkToken(TOKEN_TYPE.SEMICOLON, {optative: true, error_message: ""}); 

		/* 
	 	 * Process the statement list (stmt_list) TOKENS
	 	 */
			if(this.hasNext() && this.TOKEN_ARRAY[this.grammar_index].type != TOKEN_TYPE.R_BRACK)
				this._stmt_list();
}

Parser.prototype._stmt = function() { // stmt : node_stmt | edge_stmt | attr_stmt | ID ’=’ ID | subgraph 

	/* 
	 * Process the node statement (_node_stmt) TOKENS
	 */
	if(this.hasNext() &&
		((this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.ID       && this.TOKEN_ARRAY[this.grammar_index+1].type != TOKEN_TYPE.EDGEOP && this.TOKEN_ARRAY[this.grammar_index+1].type != TOKEN_TYPE.EQUAL   ) ||
		(this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.QUOTE    && this.TOKEN_ARRAY[this.grammar_index+2].type != TOKEN_TYPE.EDGEOP && this.TOKEN_ARRAY[this.grammar_index+2].type != TOKEN_TYPE.EQUAL 
																		  && this.TOKEN_ARRAY[this.grammar_index+3].type != TOKEN_TYPE.EDGEOP && this.TOKEN_ARRAY[this.grammar_index+3].type != TOKEN_TYPE.EQUAL)))
			this._node_stmt();
	else
	/* 
	 * Process the edge statement (_edge_stmt) TOKENS
	 */
	if(this.hasNext() &&
		((this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.ID     && this.TOKEN_ARRAY[this.grammar_index+1].type == TOKEN_TYPE.EDGEOP ) ||
		 (this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.QUOTE  && (this.TOKEN_ARRAY[this.grammar_index+2].type == TOKEN_TYPE.EDGEOP  || this.TOKEN_ARRAY[this.grammar_index+3].type == TOKEN_TYPE.EDGEOP))))
			this._edge_stmt();
	else
	/* 
	 * Process the attribut statement (_attr_stmt) TOKENS
	 */
	if(this.hasNext() &&
		(this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.GRAPH  ||
		 this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.NODE   ||
		 this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.EDGE   ))
			this._attr_stmt();
	else
	/* 
	 * Process the ID '=' ID
	 */
	if(this.hasNext() &&
		(this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.ID  || this.TOKEN_ARRAY[this.grammar_index+2].type == TOKEN_TYPE.QUOTE)){  //SOME LOOKAHEAD

		// ID                 Verifies the existence of an ID
		this._checkID(false); 
		// ’=’                Verifies the existence of an EQUAL
		this._checkToken(TOKEN_TYPE.EQUAL, {optative: false, error_message: "\nThe \'=\' primitive is missing."}); 
		// ID                 Verifies the existence of an ID
		this._checkID(false);
	}
	else
		throw Parse_Error('Parsing error. The input TOKENS are not valids to execute stmt function.');
}

Parser.prototype._attr_stmt = function() { // attr_stmt : (graph | node | edge) attr_list **DONE**
	
	// (graph | node | edge)        Verifies the existence of one of the three primitives.   
		this._checkToken3(TOKEN_TYPE.GRAPH, TOKEN_TYPE.NODE, TOKEN_TYPE.EDGE, {optative: true, error_message: ""}); 

	/* 
	 * Process the attribut list (_attr_list) TOKENS
	 */
		this._attr_list();
}

Parser.prototype._attr_list = function(){ // attr_list : ’[ ’ [ a_list ] ’] ’ [ attr_list ] **DONE**

	// ’[’                Verifies the existence of a L_SQR_BRACK
	this._checkToken(TOKEN_TYPE.L_SQR_BRACK, {optative: false, error_message: "\nThe \'[\' primitive is missing."}); 

	/* 
	 * Process the attribut list (_a_list) TOKENS
	 */
	
		this._a_list();

	// ’]’                Verifies the existence of a R_SQR_BRACK
	this._checkToken(TOKEN_TYPE.R_SQR_BRACK, {optative: false, error_message: "\nThe \']\' primitive is missing."}); 

	if(this.hasNext() && this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.L_SQR_BRACK)
		this._attr_list();
}

Parser.prototype._a_list = function(){ // a_list : ID ’=’ ID [ ( ’; ’ | ’ , ’) ] [ a_list ] **DONE**

	// ID                      Verifies the existence of a ID
	this._checkID(false);

	// ’=’                     Verifies the existence of a L_SQR_BRACK
	this._checkToken(TOKEN_TYPE.EQUAL, {optative: false, error_message: "\nThe \'=\' primitive is missing."}); 

	// ID                      Verifies the existence of a ID
	this._checkID(false);

	// [ ( ’; ’ | ’ , ’) ]     (optative)
	this._checkToken2(TOKEN_TYPE.SEMICOLON , TOKEN_TYPE.COMMA, {optative: true, error_message: ""});

	if(this.hasNext() && (this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.ID || this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.QUOTE))
		this._a_list();
}

Parser.prototype._node_stmt = function(){ // node_stmt : node_id [ attr_list ] **DONE**
	/* 
	 * Process the node id (_node_id) TOKENS
	 */
	
		this._node_id();

	if(this.hasNext() && this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.L_SQR_BRACK)
		this._attr_list();
}

Parser.prototype._node_id = function(){ // node_id : ID [ port ] **DONE**

	this._checkID(true);

	// port not used by now
}

Parser.prototype._edge_stmt = function(){ // edge_stmt : (node_id | subgraph) edgeRHS [ attr_list ]  **DONE**
	/* 
	 * Process the node id (_node_id) TOKENS
	 */
	this._node_id(); // or subgraph(not implemented)

	/* 
	 * Process the edgeRHS (_edgeRHS) TOKENS
	 */
	this._edgeRHS();

	if(this.hasNext() && this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.L_SQR_BRACK)
		this._attr_list();
}

Parser.prototype._edgeRHS = function(){ // edgeRHS : edgeop (node_id | subgraph) [ edgeRHS ]    **DONE**
	
	// EDGEOP                      Verifies the existence of a EDGEOP
	this._checkToken(TOKEN_TYPE.EDGEOP, {optative: false, error_message: ""});

	/* 
	 * Process the node id (_node_id) TOKENS
	 */
	this._node_id(); // or subgraph(not implemented)

	if(this.hasNext() && this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.EDGEOP)
		this._edgeRHS();
}







Parser.prototype._checkID = function(_optative){
	if(this.hasNext() && this.TOKEN_ARRAY[this.grammar_index].type == TOKEN_TYPE.QUOTE){
		// "                      Verifies the existence of a "
		this._checkToken(TOKEN_TYPE.QUOTE, {optative: false, error_message: ""});

		// ID                      Verifies the existence of a ID
		this._checkToken(TOKEN_TYPE.ID, {optative: _optative, error_message: ""});

		// "                      Verifies the existence of a "
		this._checkToken(TOKEN_TYPE.QUOTE, {optative: false, error_message: "Missing \" to close the ID"});
	}
	else
		// ID                      Verifies the existence of a ID
		this._checkToken(TOKEN_TYPE.ID, {optative: false, error_message: ""});
}

Parser.prototype._checkToken = function(_TOKEN_TYPE, options){
	if(this.hasNext() &&
		this.TOKEN_ARRAY[this.grammar_index].type == _TOKEN_TYPE)
			this.grammar_index++;
	else
		if(!options.optative)
			throw Parse_Error('*PARSING ERROR*\n' 
				+ 'Parser expected a ' + _TOKEN_TYPE + ' TOKEN, but the entrie is a ' + this.TOKEN_ARRAY[this.grammar_index].type + ' TOKEN.'
				+ options.error_message + '\n'
				+ 'Input TOKEN (' + this.TOKEN_ARRAY[this.grammar_index].type + ') number ' + (this.grammar_index+1) + '.\n');
}

Parser.prototype._checkToken2 = function(_TOKEN_TYPE1, _TOKEN_TYPE2, options){
	if(this.hasNext() &&
		this.TOKEN_ARRAY[this.grammar_index].type == _TOKEN_TYPE1 ||
		this.TOKEN_ARRAY[this.grammar_index].type == _TOKEN_TYPE2)
			this.grammar_index++;
	else
		if(!options.optative)
			throw Parse_Error('*PARSING ERROR*\n' 
				+ 'Parser expected a ' + _TOKEN_TYPE1 + ' or ' + _TOKEN_TYPE2 + ' TOKEN, but the entrie is a ' + this.TOKEN_ARRAY[this.grammar_index].type + ' TOKEN.' 
				+  options.error_message + '\n'
				+ 'Input TOKEN (' + this.TOKEN_ARRAY[this.grammar_index].type + ') number ' + (this.grammar_index+1) + '.\n');
}

Parser.prototype._checkToken3 = function(_TOKEN_TYPE1, _TOKEN_TYPE2, _TOKEN_TYPE3, options){
	if(this.hasNext() &&
		this.TOKEN_ARRAY[this.grammar_index].type == _TOKEN_TYPE1 ||
		this.TOKEN_ARRAY[this.grammar_index].type == _TOKEN_TYPE2 ||
		this.TOKEN_ARRAY[this.grammar_index].type == _TOKEN_TYPE3)
			this.grammar_index++;
	else
		if(!options.optative)
			throw Parse_Error('*PARSING ERROR*\n' 
				+ 'Parser expected a ' + _TOKEN_TYPE1 + ', ' + _TOKEN_TYPE2 + ' or ' + _TOKEN_TYPE3 + ' TOKEN, but the entrie is a ' + this.TOKEN_ARRAY[this.grammar_index].type + ' TOKEN.' 
				+  options.error_message + '\n'
				+ 'Input TOKEN (' + this.TOKEN_ARRAY[this.grammar_index].type + ') number ' + (this.grammar_index+1) + '.\n');
}

Parser.prototype.hasNext = function() {

	if (this.TOKEN_ARRAY){
		if(!(this.grammar_index < this.TOKEN_ARRAY.length))
			throw Parse_Error('Parsing error. Primitives missing. No TOKENS to continue the analyse.');

	}
	else
		throw Parse_Error('Parsing error. Primitives missing. No TOKENS to continue the analyse.');

	return true;
}

Parser.prototype.toOutputObject = function(){
	return  {
		'lexical_analisys': {
			'n_tokens': this.grammar_index,
			'tokens': this.TOKEN_ARRAY,  
			'token_diversity': this.TOKENS_DIVERSITY
		},
   		'syntactic_analysis':{
   		}
	}
}
   
Parser.prototype.initParsing = function(script_code) {

 	this.lexer = new Lexer(script_code);

	for(var itr in TOKEN_TYPE)
		this.TOKENS_DIVERSITY[TOKEN_TYPE[itr]] = 0;

	if(this.displayRunningTimeInfo)
		console.log('TOKENS Generation (Lexical Analysis)\n');

	
		var _temp_TOKEN;
		while (this.lexer.hasNext()){

			if(_temp_TOKEN = this.lexer.nextToken())
				this.TOKEN_ARRAY.push(_temp_TOKEN);
			else
				continue;

			if(this.displayRunningTimeInfo)
				console.log(this.TOKEN_ARRAY[this.TOKEN_ARRAY.length-1]);

			this.TOKENS_DIVERSITY[_temp_TOKEN.type] ++;
		}

	if(this.displayRunningTimeInfo){
		var orderlyTOKENS = '';

		for(var i in this.TOKEN_ARRAY)
			orderlyTOKENS += this.TOKEN_ARRAY[i].type + ' ';

		console.log('\nTOKENS in a row:\n\n' + orderlyTOKENS);
		console.log(this.TOKENS_DIVERSITY);
	}

	
		this._graph();
	
	
}

module.exports.Parser = Parser;