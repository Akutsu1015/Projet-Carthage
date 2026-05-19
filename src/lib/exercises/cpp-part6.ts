import { addExercises } from "./registry";
import type { Exercise } from "./registry";

const exercises: Exercise[] = [
    // === PROJET FINAL: SIMULATEUR NAVSKID (121-125) ===
    {
        id: "cpp_121",
        type: "intro",
        category: "Projet Game Dev",
        title: "Projet Final : Simulateur NavSkid en C++",
        description: "Créez la logique C++ d'un sous-marin sur Lyoko.",
        content: `<h3>🕹️ Projet Final : Simulateur NavSkid</h3>
<p>Pour clôturer votre apprentissage du C++, Jérémie Belpois vous a chargé d'optimiser le code de navigation des NavSkids dans la Mer Numérique.</p>
<p><strong>Votre Objectif :</strong> Utiliser la puissance des classes, de la STL et des pointeurs en C++ pour créer un simulateur performant.</p>
<h4>Étapes du projet :</h4>
<ol>
  <li>Programmer la structure <code>Vector3D</code> pour les déplacements</li>
  <li>Créer le gestionnaire d'énergie (RAII)</li>
  <li>Programmer les Collisions avec les monstres marins (Mantas)</li>
  <li>Gérer le radar du NavSkid à l'aide des algorithmes STL</li>
  <li>Déployer le Skidbladnir (Modèle singleton ou intelligent)</li>
</ol>
<p>Préparez-vous à plonger !</p>`,
    },
    {
        id: "cpp_122",
        type: "code",
        category: "Projet Game Dev",
        title: "1. Moteur Physique (Vector3D)",
        description: "Surchargez les opérateurs C++ pour les mathématiques 3D.",
        instruction: "Créez un <code>struct Vector3D</code> avec x, y, z. Surchargez l'opérateur <code>+</code> pour additionner deux vecteurs (mouvement). Affichez la nouvelle position d'un NavSkid après son déplacement.",
        code_template: `#include <iostream>

struct Vector3D {
    float x, y, z;
    // Constructeur par defaut et avec parametres
    // Surchargez l'operateur +
};

int main() {
    // NavSkid part a (10, 0, 50)
    // Deplacement de (5, 2, -10)
    // Affichez la nouvelle position
    return 0;
}`,
        solution: `#include <iostream>

struct Vector3D {
    float x, y, z;
    
    Vector3D(float x=0, float y=0, float z=0) : x(x), y(y), z(z) {}
    
    Vector3D operator+(const Vector3D& other) const {
        return Vector3D(x + other.x, y + other.y, z + other.z);
    }
};

int main() {
    Vector3D position(10.0f, 0.0f, 50.0f);
    Vector3D mouvement(5.0f, 2.0f, -10.0f);
    
    Vector3D nouvelle_position = position + mouvement;
    
    std::cout << "Position actuelle: X=" << nouvelle_position.x 
              << " Y=" << nouvelle_position.y 
              << " Z=" << nouvelle_position.z << std::endl;
              
    return 0;
}`,
        tests: [
            { expected: "operator+", type: "contains" },
            { expected: "nouvelle_position.x", type: "contains" },
            { expected: "Vector3D", type: "contains" }
        ]
    },
    {
        id: "cpp_123",
        type: "code",
        category: "Projet Game Dev",
        title: "2. Gestionnaire d'Énergie (RAII / Pointeurs)",
        description: "Ne laissez pas de fuites mémoire dans le Skid !",
        instruction: "Créez une classe <code>Bouclier</code>. Dans son constructeur, allouez dynamiquement l'énergie (message <code>\"Bouclier activé\"</code>). Dans le destructeur, libérez l'énergie (message <code>\"Bouclier coupé\"</code>). Testez ça avec un pointeur intelligent <code>std::unique_ptr</code>.",
        code_template: `#include <iostream>
#include <memory>

class Bouclier {
public:
    // Constructeur
    // Destructeur
    void activerEnergie() { std::cout << "Energie stable." << std::endl; }
};

int main() {
    // Utilisez std::unique_ptr pour gerer le bouclier
    return 0;
}`,
        solution: `#include <iostream>
#include <memory>

class Bouclier {
public:
    Bouclier() {
        std::cout << "Bouclier activé" << std::endl;
    }
    ~Bouclier() {
        std::cout << "Bouclier coupé" << std::endl;
    }
    
    void activerEnergie() { 
        std::cout << "Energie stable." << std::endl; 
    }
};

int main() {
    {
        std::unique_ptr<Bouclier> bouclierDuSkid = std::make_unique<Bouclier>();
        bouclierDuSkid->activerEnergie();
    } // Le destructeur est appele automatiquement ici
    
    std::cout << "Fin du programme." << std::endl;
    return 0;
}`,
        tests: [
            { expected: "~Bouclier()", type: "contains" },
            { expected: "std::unique_ptr", type: "contains" },
            { expected: "make_unique", type: "contains" }
        ]
    },
    {
        id: "cpp_124",
        type: "code",
        category: "Projet Game Dev",
        title: "3. Le Radar (Algorithmes STL)",
        description: "Détectez les ennemis dans la Mer Numérique.",
        instruction: "Le radar retourne une <code>std::vector&lt;int&gt;</code> contenant les ids des monstres proches. Utilisez les tris de la STL (<code>std::sort</code>, <code>std::unique</code>) pour supprimer les doublons et afficher les ID uniques détectés.",
        code_template: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> radar = {404, 200, 404, 666, 200, 100, 666};
    
    // Triez le vecteur
    // Supprimez les doublons
    // Affichez chaque ID unique
    
    return 0;
}`,
        solution: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> radar = {404, 200, 404, 666, 200, 100, 666};
    
    std::sort(radar.begin(), radar.end());
    
    auto last = std::unique(radar.begin(), radar.end());
    radar.erase(last, radar.end());
    
    std::cout << "Menaces detectees : ";
    for(int id : radar) {
        std::cout << id << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,
        tests: [
            { expected: "std::sort", type: "contains" },
            { expected: "std::unique", type: "contains" },
            { expected: "radar.erase", type: "contains" }
        ]
    },
    {
        id: "cpp_125",
        type: "code",
        category: "Projet Game Dev",
        title: "4. Le Système de Pilotage",
        description: "Liez le tout avec des templates C++.",
        instruction: "Créez une fonction template <code>piloter&lt;T&gt;(T vehicule)</code> qui appelle une méthode <code>avancer()</code> sur l'objet passé. Transmettez un <code>NavSkid</code> et un <code>Overboard</code> pour prouver que le pilote fonctionne sur les deux.",
        code_template: `#include <iostream>

class NavSkid {
public:
    void avancer() { std::cout << "Le NavSkid plonge." << std::endl; }
};

class Overboard {
public:
    void avancer() { std::cout << "L'Overboard file." << std::endl; }
};

// Fonction template piloter<T>

int main() {
    NavSkid ns;
    Overboard ov;
    // Pilotez les deux
    return 0;
}`,
        solution: `#include <iostream>

class NavSkid {
public:
    void avancer() { std::cout << "Le NavSkid plonge." << std::endl; }
};

class Overboard {
public:
    void avancer() { std::cout << "L'Overboard file." << std::endl; }
};

template <typename T>
void piloter(T vehicule) {
    vehicule.avancer();
}

int main() {
    NavSkid ns;
    Overboard ov;
    
    piloter(ns);
    piloter(ov);
    
    return 0;
}`,
        tests: [
            { expected: "template <typename T>", type: "contains" },
            { expected: "vehicule.avancer()", type: "contains" },
            { expected: "piloter(", type: "contains" }
        ]
    }
];

addExercises("cpp", exercises);
