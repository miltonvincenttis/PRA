package appdev.dominio;

import java.io.Serializable;

/**
 * Essa classe representa um registro feito na pagina Registrar.html.
 * Possui os mesmo atributos e operações da classe Autenticacao.
 *
 * Por isso herda os dados de Autenticacao, e serve apenas para se diferenciar.
 *
 */
public class Registro extends Autenticacao implements Serializable {}
