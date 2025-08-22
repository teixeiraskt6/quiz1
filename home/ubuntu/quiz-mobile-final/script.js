document.addEventListener("DOMContentLoaded", function() {
    let currentQuestion = 1;
    const totalQuestions = 4;
    
    // Elementos do DOM
    const questionSlides = document.querySelectorAll(".question-slide");
    const answerButtons = document.querySelectorAll(".answer-btn");
    // const effectsOverlay = document.querySelector(".effects-overlay");
    const storyProgressBars = document.querySelectorAll(".story-progress-bar");
    
    // Função para criar efeitos de partículas
    function createParticleEffect(x, y) {
        const particle = document.createElement("div");
        particle.style.position = "fixed";
        particle.style.left = x + "px";
        particle.style.top = y + "px";
        particle.style.width = "4px";
        particle.style.height = "4px";
        particle.style.background = "linear-gradient(45deg, #9CCC65, #E53935)";
        particle.style.borderRadius = "50%";
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "1000";
        particle.style.animation = "particleFloat 1s ease-out forwards";
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    // Função para criar efeito de onda
    function createRippleEffect(element, x, y) {
        const ripple = document.createElement("div");
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.position = "absolute";
        ripple.style.left = (x - rect.left - size / 2) + "px";
        ripple.style.top = (y - rect.top - size / 2) + "px";
        ripple.style.width = size + "px";
        ripple.style.height = size + "px";
        ripple.style.background = "rgba(156, 204, 101, 0.3)";
        ripple.style.borderRadius = "50%";
        ripple.style.transform = "scale(0)";
        ripple.style.animation = "ripple 0.6s ease-out";
        ripple.style.pointerEvents = "none";
        
        element.style.position = "relative";
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Função para vibrar o dispositivo (se suportado)
    function vibrateDevice() {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    


    // Função para transição entre perguntas
    function goToQuestion(questionNumber) {
        const currentSlide = document.getElementById(`question${currentQuestion}`);
        const nextSlide = document.getElementById(`question${questionNumber}`);
        
        if (currentSlide && nextSlide) {
            // Animação de saída
            currentSlide.classList.add("prev");
            currentSlide.classList.remove("active");
            
            // Pequeno delay para a animação
            setTimeout(() => {
                // Animação de entrada
                nextSlide.classList.add("active");
                nextSlide.classList.remove("prev");
                
                currentQuestion = questionNumber;
                
                // Atualizar barra de progresso do story
                updateStoryProgressBar();
                
                // Efeito de partículas na transição
                createTransitionEffect();
            }, 100);
        }
    }
    
    // Função para atualizar barra de progresso do story
    function updateStoryProgressBar() {
        storyProgressBars.forEach((bar, index) => {
            if (index < currentQuestion - 1) {
                bar.classList.remove("active");
                bar.classList.add("completed");
            } else if (index === currentQuestion - 1) {
                bar.classList.remove("completed");
                bar.classList.add("active");
            } else {
                bar.classList.remove("active", "completed");
            }
        });
    }
    
    // Função para criar efeito de transição
    function createTransitionEffect() {
        // Criar múltiplas partículas
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                createParticleEffect(x, y);
            }, i * 50);
        }
    }
    
    // Função para efeito de shake
    function shakeScreen() {
        document.body.style.animation = "shake 0.5s ease-in-out";
        setTimeout(() => {
            document.body.style.animation = "";
        }, 500);
    }
    
    // Event listeners para os botões de resposta
    answerButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Vibração
            vibrateDevice();
            
            // Efeito de ripple
            createRippleEffect(this, e.clientX, e.clientY);
            
            // Efeito de partículas no clique
            createParticleEffect(e.clientX, e.clientY);
            
            // Animação do botão
            this.style.transform = "scale(0.95)";
            setTimeout(() => {
                this.style.transform = "";
            }, 150);
            
            // Verificar se é o botão final
            if (this.classList.contains("final-btn")) {
                // Efeito especial para o botão final
                shakeScreen();
                
                // Criar efeito de explosão de partículas
                for (let i = 0; i < 20; i++) {
                    setTimeout(() => {
                        const angle = (i / 20) * Math.PI * 2;
                        const distance = 100;
                        const x = e.clientX + Math.cos(angle) * distance;
                        const y = e.clientY + Math.sin(angle) * distance;
                        createParticleEffect(x, y);
                    }, i * 30);
                }
                
                // Aqui você pode adicionar a ação final (redirect, modal, etc.)
                setTimeout(() => {
                    alert("🔥 Parabéns! Você está pronto para descobrir o método!");
                }, 1000);
                
                return;
            }
            
            // Transição para próxima pergunta
            const nextQuestion = this.getAttribute("data-next");
            if (nextQuestion) {
                const nextQuestionNumber = parseInt(nextQuestion.replace("question", ""));
                
                goToQuestion(nextQuestionNumber);
            }
        });
        
        // Efeito hover melhorado
        button.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-2px) scale(1.02)";
        });
        
        button.addEventListener("mouseleave", function() {
            this.style.transform = "";
        });
    });
    

    
    // Efeito de cursor personalizado
    document.addEventListener("mousemove", function(e) {
        // Criar trail de cursor (opcional)
        if (Math.random() > 0.95) {
            createParticleEffect(e.clientX, e.clientY);
        }
    });
    
    // Prevenção de zoom em mobile
    document.addEventListener("touchstart", function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    });
    
    let lastTouchEnd = 0;
    document.addEventListener("touchend", function(e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Inicialização
    updateStoryProgressBar(); // Define a barra de progresso inicial
    console.log("Quiz inicializado com sucesso!");
});

// CSS adicional para animações via JavaScript
const additionalStyles = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

