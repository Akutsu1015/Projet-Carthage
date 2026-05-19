import { addExercises } from "./registry";
import type { Exercise } from "./registry";

const exercises: Exercise[] = [
    // === PROJET FINAL: TOWER DEFENSE LYOKO (151-155) ===
    {
        id: "cs_151",
        type: "intro",
        category: "Projet Game Dev",
        title: "Projet Final : Lyoko Tower Defense en C#",
        description: "Créez un mini-jeu de défense de territoire dans le terminal.",
        content: `<h3>🎮 Projet Final : Lyoko Tower Defense</h3>
<p>Bienvenue dans le défi final du module C# ! Vous allez programmer un simulateur de bataille dans le Secteur Glace de Lyoko.</p>
<p><strong>Votre Objectif :</strong> Créer l'architecture orientée objet d'un jeu où l'équipe attaque des Kankrelats et protège Aelita.</p>
<h4>Étapes du projet :</h4>
<ol>
  <li>Créer le système de Héros et d'Armes</li>
  <li>Gérer le comportement des Monstres (Kankrelats, Krabes)</li>
  <li>Mettre en place la boucle de jeu principale</li>
  <li>Implémenter le système de dégâts et de points de vie</li>
  <li>Gérer les événements avec des délégués (Delegates/Events)</li>
</ol>
<p>Utilisez vos connaissances en POO, LINQ et C# moderne pour réussir cette mission !</p>`,
    },
    {
        id: "cs_152",
        type: "code",
        category: "Projet Game Dev",
        title: "1. Classes de Base et Héritage",
        description: "Structurez les entités du jeu sur Lyoko.",
        instruction: "Créez une classe abstraite <code>Entite</code> avec <code>Nom</code> (string) et <code>Pvs</code> (int). Créez <code>Hero</code> et <code>Monstre</code> qui en héritent. Héros a une méthode <code>Attaquer(Monstre m)</code> qui réduit les PVs du monstre de 20.",
        code_template: `using System;

// Classe abstraite Entite

// Classe Hero

// Classe Monstre

class Program
{
    static void Main()
    {
        // Instanciez un Hero "Ulrich" et un Monstre "Krab"
        // Ulrich attaque le Krab
    }
}`,
        solution: `using System;

abstract class Entite
{
    public string Nom { get; set; }
    public int Pvs { get; set; }
    
    public Entite(string nom, int pvs)
    {
        Nom = nom;
        Pvs = pvs;
    }
}

class Hero : Entite
{
    public Hero(string nom, int pvs) : base(nom, pvs) {}
    
    public void Attaquer(Monstre cible)
    {
        cible.Pvs -= 20;
        Console.WriteLine($"{Nom} attaque {cible.Nom} ! PV restants : {cible.Pvs}");
    }
}

class Monstre : Entite
{
    public Monstre(string nom, int pvs) : base(nom, pvs) {}
}

class Program
{
    static void Main()
    {
        var ulrich = new Hero("Ulrich", 100);
        var krab = new Monstre("Krab", 50);
        
        ulrich.Attaquer(krab);
    }
}`,
        tests: [
            { expected: "abstract class Entite", type: "contains" },
            { expected: "class Hero : Entite", type: "contains" },
            { expected: "class Monstre : Entite", type: "contains" },
            { expected: "cible.Pvs", type: "contains" },
        ]
    },
    {
        id: "cs_153",
        type: "code",
        category: "Projet Game Dev",
        title: "2. LINQ pour la Gestion des Monstres",
        description: "Utilisez LINQ pour filtrer les cibles.",
        instruction: "Vous avez une <code>List&lt;Monstre&gt;</code>. Utilisez <code>LINQ</code> pour :<br>1. Trouver les monstres encore en vie (PV > 0).<br>2. Trouver le monstre avec le moins de PV. Affichez son nom.",
        code_template: `using System;
using System.Collections.Generic;
using System.Linq;

class Monstre
{
    public string Nom { get; set; }
    public int Pvs { get; set; }
}

class Program
{
    static void Main()
    {
        var monstres = new List<Monstre>
        {
            new Monstre { Nom = "Kankrelat 1", Pvs = 10 },
            new Monstre { Nom = "Kankrelat 2", Pvs = 0 },
            new Monstre { Nom = "Krab", Pvs = 40 }
        };

        // TODO: Trouver les monstres vivants et le plus faible parmi eux
    }
}`,
        solution: `using System;
using System.Collections.Generic;
using System.Linq;

class Monstre
{
    public string Nom { get; set; }
    public int Pvs { get; set; }
}

class Program
{
    static void Main()
    {
        var monstres = new List<Monstre>
        {
            new Monstre { Nom = "Kankrelat 1", Pvs = 10 },
            new Monstre { Nom = "Kankrelat 2", Pvs = 0 },
            new Monstre { Nom = "Krab", Pvs = 40 }
        };

        var vivants = monstres.Where(m => m.Pvs > 0).ToList();
        var plusFaible = vivants.OrderBy(m => m.Pvs).FirstOrDefault();

        Console.WriteLine($"Monstres vivants : {vivants.Count}");
        if (plusFaible != null) {
            Console.WriteLine($"Cible prioritaire : {plusFaible.Nom}");
        }
    }
}`,
        tests: [
            { expected: ".Where(", type: "contains" },
            { expected: "m.Pvs > 0", type: "contains" },
            { expected: ".OrderBy(", type: "contains" }
        ]
    },
    {
        id: "cs_154",
        type: "code",
        category: "Projet Game Dev",
        title: "3. Interfaces et Armes Spéciales",
        description: "Définissez un comportement d'arme avec des interfaces.",
        instruction: "Créez une interface <code>IArme</code> avec une méthode <code>void Action(Hero porteur, Monstre cible)</code>. Créez ensuite une classe <code>Sabre</code> (inflige 30 dégâts) et <code>Eventail</code> (inflige 15 dégâts mais soigne le héros de +5). Testez-les !",
        code_template: `using System;

class Hero { public string Nom; public int Pvs; }
class Monstre { public string Nom; public int Pvs; }

// Interface IArme

// Classe Sabre

// Classe Eventail

class Program
{
    static void Main()
    {
        // Testez le Sabre et l'Eventail
    }
}`,
        solution: `using System;

class Hero { public string Nom; public int Pvs; }
class Monstre { public string Nom; public int Pvs; }

interface IArme
{
    void Action(Hero porteur, Monstre cible);
}

class Sabre : IArme
{
    public void Action(Hero porteur, Monstre cible)
    {
        cible.Pvs -= 30;
        Console.WriteLine($"{porteur.Nom} frappe avec le Sabre! -30 PV");
    }
}

class Eventail : IArme
{
    public void Action(Hero porteur, Monstre cible)
    {
        cible.Pvs -= 15;
        porteur.Pvs += 5;
        Console.WriteLine($"{porteur.Nom} lance l'Éventail! -15 PV. Soin +5 PV.");
    }
}

class Program
{
    static void Main()
    {
        var ulrich = new Hero { Nom = "Ulrich", Pvs = 100 };
        var yumi = new Hero { Nom = "Yumi", Pvs = 90 };
        var krab = new Monstre { Nom = "Krab", Pvs = 100 };
        
        IArme sabre = new Sabre();
        IArme eventail = new Eventail();
        
        sabre.Action(ulrich, krab);
        eventail.Action(yumi, krab);
    }
}`,
        tests: [
            { expected: "interface IArme", type: "contains" },
            { expected: "class Sabre : IArme", type: "contains" },
            { expected: "class Eventail : IArme", type: "contains" },
            { expected: "Action(Hero", type: "contains" }
        ]
    },
    {
        id: "cs_155",
        type: "code",
        category: "Projet Game Dev",
        title: "4. Délégués et Événements (Game Over)",
        description: "Déclenchez des actions avec les événements C#.",
        instruction: "Ajoutez un événement <code>Action OnDeath</code> à votre classe <code>Tour</code> (qui a des points de vie). Dans la boucle de main, abonnez une méthode qui affiche <strong>\"Dévirtualisation ! Tour détruite.\"</strong>. Descendez les PV à 0 en appelant PrendreDegats pour déclencher l'événement.",
        code_template: `using System;

class Tour
{
    public int Pvs { get; set; } = 100;
    // Créez l'événement OnDeath
    
    public void PrendreDegats(int d)
    {
        Pvs -= d;
        // Si PV <= 0, déclenchez OnDeath
    }
}

class Program
{
    static void Main()
    {
        var tour = new Tour();
        // Abonnez-vous à OnDeath
        // Infligez 100 de dégâts
    }
}`,
        solution: `using System;

class Tour
{
    public int Pvs { get; set; } = 100;
    public event Action OnDeath;
    
    public void PrendreDegats(int degats)
    {
        Pvs -= degats;
        Console.WriteLine($"Tour attaquée ! Reste {Pvs} PV.");
        if (Pvs <= 0)
        {
            OnDeath?.Invoke();
        }
    }
}

class Program
{
    static void Main()
    {
        var tour = new Tour();
        tour.OnDeath += () => Console.WriteLine("Dévirtualisation ! Tour détruite.");
        
        tour.PrendreDegats(50);
        tour.PrendreDegats(60); // Doit déclencher l'event
    }
}`,
        tests: [
            { expected: "public event Action OnDeath", type: "contains" },
            { expected: "OnDeath?.Invoke()", type: "contains" },
            { expected: "tour.OnDeath +=", type: "contains" }
        ]
    }
];

addExercises("csharp", exercises);
