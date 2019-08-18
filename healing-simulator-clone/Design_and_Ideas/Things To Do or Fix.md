*Healing-simulator-Clone Ideas*

Spell casting:
  Mana:
  - Potentionally mana orbs you can click as a distraction to gain mana
  - Add an error message when you dont have enough mana for casting a spell.
  
  Spells:
    Cooldown:
      Some spells should have a cooldown, limiting you how often you are able to cast it. Ideally it should show a
      rotating timer around the spell icon to show when it is ready again. Spells have a cooldown, but need a css
      animation on the icon. The cooldown is also not currently used.
    SpellTargets:
      In the spell objects, add amount of targets the heal should heal and it can be used in the for loops and I dont
      have to check for array when looping.

  Castbar:
    Should show the time remaining on the cast as seconds.
    
CSS:
  Investigate how I can use flexbox instead of using margin everywhere.
  
CodeStructure:
  App.vue is way too big and handles way too many things. This should be split up in further files/components
  The spell casting code is a bit convoluted. This should be able to be refined and more generic.


Idea for how spell casting should work:
  An array of all spells, each spell as an object. 
  The spell has: 
  - name
  - mana cost 
  - heal amount 
  - amount of targets (1-many)
  
  When casting the spell I should receive the target or targets as an array and just loop through
  length and heal those that are in the array. So that I do not need to have edge cases for every spell.
    
Boss health:
Progression:

Tanks, Healers and Dps and YOU:
  * Tanks: 
  There should be two tanks, they should take more focused damage and needs to be kept under vision.
  The damage on them should switch under the encounters as to simulate tank swaps. These should have
  more HP and have a different colour on the raid frames bar, aswell as a different name.
  If the tanks die, the boss should start attackign the other raid members which will quickly kill them

  * Healers:
  Alongside you should be two other healers. When they are alive they should passively give hp regen
  to the raid. And if one is dead they give less regen. If both are dead there is no regen. Or, alternaviely
  they could be factored into mana regen somehow. That is if you keep them alive you regen more mana
  
  * Dpsers:
  The remaining raiders are the dps players. These make sure that if alive will passively do damage
  to the boss. Each dpser is worth the same and causes the boss hp to reduce at a rate depending on how
  many dpsers that are alive.
  
  * YOU:
  You, as one of the three healers have your own raid frame and HP. If you die, then you will not be able to heal anymore
  and will have to sit and wait to see if your raid can survive the encounter without you. 
  You will need to balance your health and the raid's health to win the encounters.
Fun side-ideas:
  Healing meter:

Components:
  * Cast bar (Should accept a cast time, spell name)
  * Health bar (Could possibly be used for both boss and players, with different
  values send in)
  * Mana bar
  * Raid member
  * Raid boss
  * Spell bar
  * Spell icon
  * Raid frame
  * Logic (should this be a component?)
  
  


