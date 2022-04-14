package appdev.recursos;

public class Tester {
    public static boolean temNomeMaior(int tamanho, StringBuilder nome){
        boolean resultado = false;

        String[] nomes = nome.toString().split(" ");
        for (String umNome: nomes) {
            if(umNome.length() > 12){
                resultado = true;
                break;
            }
        }
        return resultado;
    }


    public static void main(String[] args) {
        StringBuilder nomeAbrevidado = new StringBuilder();

        String nome = "testecomentario Lima Vincenttis testecomentario";

        String[] nomes = nome.split(" ");

        final int tamanhoMaximo = 12;
        int tamanhoMaximoNomeIndividual = tamanhoMaximo;

        loopDeNovo:
        for (int i=0; i< nomes.length; i++) {
            if(nomes[i].length() > tamanhoMaximoNomeIndividual){
                nomeAbrevidado.append(nomes[i].substring(0,1).toUpperCase());
            }else{
                nomeAbrevidado.append(nomes[i]);
            }
            if(i != nomes.length-1){
                nomeAbrevidado.append(" ");
            }
            //--- caso o nome final seja maior que tamanhoMaximoNomeIndividual, a gente faz tudo de novo
            if(i == nomes.length-1 && temNomeMaior(tamanhoMaximo, nomeAbrevidado)) {
                //--- refaz o array novamente agora com o nome finalizado inteiro
                nomes = nomeAbrevidado.toString().split(" ");

                //--- dividimos o tamanho maximo do nome pra metade
                tamanhoMaximoNomeIndividual = tamanhoMaximoNomeIndividual/2;
                i=-1;
                nomeAbrevidado = new StringBuilder();

                continue loopDeNovo;
            }
        }

        System.out.println(nomeAbrevidado);
    }
}
