*Healing-simulator-Clone Ideas*

Raid members:
- There should be one or two tank raid members. These should have more health, but also take more damage. 
- There should be a few healer raid members. These will heal random players when alive
- The rest of the raid members should be normal damage dealers. Each one should deal X amount of damage per X time

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
  
  


