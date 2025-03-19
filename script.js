const BIN_ID = "67daebc48a456b79667909aa"; // Substitua pelo seu BIN_ID
const API_KEY = "$2a$10$ic.rAiITIURci3p7Ti3n3eejp086/KfAvMWYfXszJyGRsQc6W4Ttm"; // Substitua pela sua API Key
const PASSWORD = "CasamentoU&M27/09"; // Senha de acesso

let reservedNumbers = [];
let numberElements = []; // Armazena referências aos elementos de números

// Função para carregar os números reservados do JSONBin
async function fetchReservedNumbers() {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      method: "GET",
      headers: {
        "X-Master-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar os dados. Verifique o BIN_ID e a API Key.");
    }

    const data = await response.json();
    return data.record.reservedNumbers || [];
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
    alert("Erro ao carregar os dados. Verifique o console para mais detalhes.");
    return [];
  }
}

// Função para atualizar os números reservados no JSONBin
async function updateReservedNumbers(numbers) {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
      },
      body: JSON.stringify({ reservedNumbers: numbers }),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar os dados.");
    }

    alert("Dados atualizados com sucesso!");
  } catch (error) {
    console.error("Erro:", error);
    alert("Ocorreu um erro ao atualizar os dados.");
  }
}

// Quando o site é carregado
document.addEventListener("DOMContentLoaded", async () => {
  const loginScreen = document.getElementById("login-screen");
  const mainContent = document.getElementById("main-content");
  const numberGrid = document.getElementById("number-grid");
  const reservedNumbersList = document.getElementById("reserved-numbers-list");
  const removeNumberSection = document.getElementById("remove-number-section");
  const removeNumberInput = document.getElementById("remove-number");
  const removeNumberButton = document.getElementById("remove-number-button");

  // Verificar a senha
  document.getElementById("login-button").addEventListener("click", () => {
    const passwordInput = document.getElementById("password").value;
    if (passwordInput === PASSWORD) {
      loginScreen.style.display = "none";
      mainContent.style.display = "block";
      loadInterface();
    } else {
      alert("Senha incorreta. Tente novamente.");
    }
  });

  // Carregar interface principal
  async function loadInterface() {
    // Gerar números de 1 a 1000
    const numbers = Array.from({ length: 1000 }, (_, i) => i + 1);

    // Criar tabela de números
    numbers.forEach((number) => {
      const div = document.createElement("div");
      div.textContent = number;
      div.classList.add("number");

      // Adiciona o elemento à lista de referências
      numberElements[number] = div;

      div.addEventListener("click", async () => {
        if (!reservedNumbers.includes(number)) {
          div.classList.add("selected");
          div.style.pointerEvents = "none"; // Desativa o clique
          reservedNumbers.push(number);
          await updateReservedNumbers(reservedNumbers);
          renderReservedNumbers();
        }
      });

      numberGrid.appendChild(div);
    });

    // Carregar números reservados inicialmente
    reservedNumbers = await fetchReservedNumbers();
    renderNumbers();
    renderReservedNumbers();
  }

  // Renderizar números reservados na interface
  function renderNumbers() {
    reservedNumbers.forEach((number) => {
      const div = numberElements[number];
      if (div) {
        div.classList.add("selected");
        div.style.pointerEvents = "none"; // Desativa o clique
      }
    });
  }

  // Renderizar lista de números reservados
  function renderReservedNumbers() {
    reservedNumbersList.innerHTML = "";
    if (reservedNumbers.length > 0) {
      reservedNumbersList.innerHTML = `<p>Números Reservados: ${reservedNumbers.join(", ")}</p>`;
    } else {
      reservedNumbersList.innerHTML = "<p>Nenhum número reservado.</p>";
    }
  }

  // Carregar dados ao clicar no botão
  document.getElementById("load-data").addEventListener("click", async () => {
    reservedNumbers = await fetchReservedNumbers();
    renderNumbers(); // Atualiza a interface com os números carregados
    renderReservedNumbers(); // Atualiza a lista de números reservados
    removeNumberSection.style.display = "block"; // Exibe a seção de remoção
    alert("Dados carregados com sucesso!");
  });

  // Limpar todos os dados
  document.getElementById("clear-all").addEventListener("click", async () => {
    if (confirm("Tem certeza que deseja limpar todos os dados?")) {
      await updateReservedNumbers([]);
      reservedNumbers = [];
      renderNumbers(); // Limpa a interface
      renderReservedNumbers(); // Limpa a lista de números reservados
      location.reload(); // Recarrega a página para atualizar a interface
    }
  });

  // Remover número manualmente
  removeNumberButton.addEventListener("click", async () => {
    const numberToRemove = parseInt(removeNumberInput.value.trim(), 10);
    if (isNaN(numberToRemove) || numberToRemove < 1 || numberToRemove > 1000) {
      alert("Por favor, insira um número válido entre 1 e 1000.");
      return;
    }

    if (!reservedNumbers.includes(numberToRemove)) {
      alert("Este número não está reservado.");
      return;
    }

    // Remove o número dos reservados
    reservedNumbers = reservedNumbers.filter((num) => num !== numberToRemove);
    const div = numberElements[numberToRemove];
    if (div) {
      div.classList.remove("selected");
      div.style.pointerEvents = "auto"; // Reativa o clique
    }

    // Atualiza o JSONBin
    await updateReservedNumbers(reservedNumbers);

    // Atualiza a lista de números reservados
    renderReservedNumbers();

    // Limpa o campo de entrada
    removeNumberInput.value = "";

    alert(`Número ${numberToRemove} removido com sucesso!`);
  });

  // Redirecionar para o formulário
  document.getElementById("go-to-form").addEventListener("click", () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSdd9BXzWsRkjOrcqdVTUHVORYPwlttayGcjYOtKSwRSyY-nqQ/viewform?usp=sharing",
      "_blank"
    );
  });
});