# 🔧 Guia de Configuração do JDK

## Problema

O Android Studio está usando Java 21, mas o projeto requer Java 17 para compatibilidade com Gradle 8.5.

## Solução Rápida

### Opção 1: Usar JDK Embutido do Android Studio (RECOMENDADO)

1. Abra o Android Studio
2. Vá em **File → Project Structure** (ou pressione `Ctrl+Alt+Shift+S`)
3. Na seção **SDK Location**:
   - Localize **Gradle Settings**
   - Em **Gradle JDK**, selecione **"Embedded JDK"** ou **"jbr-17"**
4. Clique em **OK**
5. Clique em **File → Sync Project with Gradle Files**

### Opção 2: Baixar e Configurar JDK 17

Se o JDK embutido não estiver disponível:

1. **Baixar JDK 17**:
   - [Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
   - [OpenJDK 17](https://adoptium.net/temurin/releases/?version=17)

2. **Instalar o JDK**:
   - Execute o instalador
   - Anote o caminho de instalação (ex: `C:\Program Files\Java\jdk-17`)

3. **Configurar no Android Studio**:
   - File → Project Structure → SDK Location
   - Em **Gradle JDK**, clique no dropdown
   - Selecione **"Add JDK..."**
   - Navegue até a pasta onde instalou o JDK 17
   - Selecione e clique em **OK**

4. **Sincronizar**:
   - File → Sync Project with Gradle Files

## Verificar Versão do Java

### No Android Studio:

1. View → Tool Windows → Terminal
2. Execute:
```bash
java -version
```

Deve mostrar algo como:
```
openjdk version "17.0.x"
```

### Via Linha de Comando:

```powershell
cd android-app
.\gradlew.bat --version
```

Deve mostrar:
```
JVM:          17.0.x
```

## Configuração Alternativa via gradle.properties

Se preferir, você pode forçar o uso de um JDK específico:

1. Abra `android-app/gradle.properties`
2. Adicione:
```properties
org.gradle.java.home=C\:\\Program Files\\Java\\jdk-17
```

3. Ajuste o caminho para onde seu JDK 17 está instalado

## Tabela de Compatibilidade

| Gradle | Min Java | Max Java | Recomendado |
|--------|----------|----------|-------------|
| 8.5    | 8        | 19       | **17**      |
| 8.2    | 8        | 19       | **17**      |
| 9.0+   | 8        | 21       | 17 ou 21    |

## Problemas Comuns

### "JAVA_HOME is set to an invalid directory"

**Solução:**
1. Verifique se o JDK está instalado corretamente
2. Configure a variável de ambiente `JAVA_HOME`:
   - Painel de Controle → Sistema → Configurações Avançadas
   - Variáveis de Ambiente
   - Nova variável de sistema:
     - Nome: `JAVA_HOME`
     - Valor: `C:\Program Files\Java\jdk-17` (ajuste o caminho)

### "Unsupported class file major version"

**Causa:** Código compilado com Java mais recente que o JDK configurado.

**Solução:**
1. Limpe o cache: `.\gradlew.bat clean`
2. Verifique se está usando JDK 17
3. Sincronize novamente

### Android Studio não mostra JDK 17

**Solução:**
1. Baixe e instale o JDK 17 manualmente
2. Reinicie o Android Studio
3. Adicione manualmente via "Add JDK..."

## Verificação Final

Após configurar, execute:

```powershell
cd android-app
.\gradlew.bat --version
```

Você deve ver:
```
------------------------------------------------------------
Gradle 8.5
------------------------------------------------------------

Build time:   2023-11-29 14:08:57 UTC
Revision:     28aca86a7180baa17117e0e5ba01d8ea9feca598

Kotlin:       1.9.20
Groovy:       3.0.17
Ant:          Apache Ant(TM) version 1.10.13 compiled on January 4 2023
JVM:          17.0.x (Oracle Corporation 17.0.x+x)
OS:           Windows 11 10.0 amd64
```

✅ Se o JVM mostrar versão 17.x, está correto!

---

**Última Atualização**: 09/11/2025  
**Responsável**: ANDROID-SENIOR-01 (Marina)
