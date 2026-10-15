# <div align="center"><h1>GOD:less</h1></div>

<div align="center">

[![Status](https://img.shields.io/badge/Status-Active%20Development-amber?style=for-the-badge&logo=gamepad)]()
[![Engine](https://img.shields.io/badge/Engine-Three.js%20%7C%20WebGLL2%20%7C%20WebGPU-blue?style=for-the-badge&logo=three.js)]()
[![Build](https://img.shields.io/badge/Build-Vite%20%7C%20ES%20Modules-emerald?style=for-the-badge&logo=vite)]()

</div>

---

## 🌌 Overview

**GOD:less** is an independent, next-generation browser-based divine strategy and creature simulation game. As an omnipotent deity, you command a nascent civilization, shape the living procedural terrain, guide a customizable mythological chimera, and dictate the fate of your followers through divine intervention, complex socio-economic management, and celestial might.

---

## ✨ Core Features & Architecture

### 🍛️ 1. Entkoppelte High-Performance Simulations-Engine
* **Deterministic Tick-Rate:** A robust core simulation loop running independently at 20 Ticks/Second, cleanly separated from the 60+ FPS Three.js render pipeline.
* **GPU Instanced Rendering:** Optimized rendering for thousands of trees, rocks, and villagers via `THREE.InstancedMesh`, ensuring buttery-smooth performance across desktop and mobile browsers.
* **Procedural Environment:** Synthetic terrain generation featuring multi-layered elevation steps, organic river beds, coastal drops, and procedural custom GLSL weather shaders.

### 🧢"���GV�&W"6���:G&V��FW6�v�W"bWf��WF��ࢢ��WF�V�F�2�V�F��7V6�W2gW6��㢢�6��&��R�VG2�&�F�W2�Ɩ�'2��BF��2g&��BF�7F��7BחF����v�6�7&VGW&W2��Ɩ��2�v��fW2�'V��2�6��W2�Vv�W2�W2�V�W��G2�7&�6�F��W2�G2⢠����7W&f6RbGFW&����s���F���"&VƗ7F�26����BgW"FW�GW&W2���VB�&�6WGFW2�Ɩ��gW"�F�vW"7G&�W2�6��R66�W2�67WFW2��ࢢ��7FB�6Wf��WF��㢢�&��6VB����B�&6VB����V�Ɩ֗B7�7FV�v�W&R7FG2�7G&V�wF��7VVB���FV�ƖvV�6R�vw&W76�fV�W72�Wf��fRF�&�Vv�G&���r�VW7G2��BF�f��RG&VF�V�B�fW"F��Rࠢ222	���2�v�'G66�gBb��f�Ɨ6F���2��G&������f֖ǒg2�v�&�6ƖFW#���6V��W76ǒ&��6R��W"6�f�Ɨ�F���w2f�7W>(	B�f֖ǒ��&�V�FVB�f�"&�B�V�F���w&�wF��BV�6��V&�Rf�F���"�v�&���&�V�FVB�f�"Ɩv�F��r�f7B&W6�W&6RvF�W&��r��v��B�7F��R�f��B�F���2��7G'V7GW&�Ww&FW2��BFV6�����v�6�&W6V&6�ࢢ��Gf�6VB'V��F��rG&VS���&�w&W72�&v�6�ǒg&��&6�2v��B�WG2�F�W"�F�7F��R��W6W2�F�W""��B�76�fR'F�V�B&��6�2�F�W"2��V���6�7V6�Ɨ�VB7G'V7GW&W2��6�VF��r�66����2�V�fW'6�F�W2�&�6�6֗F�2�FfW&�2�F�7F�'2�6���V�G�6V�FW'2��BV�FW'F���V�B&�2Bࢢ��6F6Ǘ6�bFW7G'V7F���7�7FVӢ��'V��F��w2fVGW&R&V��F��R�V�F����27W66WF�&�RF��GW&�F�67FW'2�F�V�FW'7F�&�2��WFV�"7G&��W2��B6�6֖2&�G2ࠢ222)�B�F�R|;gGFW&��BbG��֗66�W2&W��V�V�w2�7�7FVТ��v�BԆ�B��FW&7F��㢢�6����BF�RF�f��R7W'6�"F�w&"���fR��"�vW&gV�ǒ�W&��&�V7G2�B�V��27&�72F�Rv�&�Bv�F�&VƗ7F�2&�Ɨ7F�72ࢢ���fRg2�fV"�V6��73�����W"f����vW'2&V7BG��֖6�ǒF���W"&V�Wf��V�6R�"7'VV�G��W�6W76�fRG�&��v�F��WB��fR'&VVG2�W&W7��&V&V�Ɩ����B�72֖w&F���ࢢ�VW7G2b7'W6FW3���V���6�6F7G&���2֗&6�W2��Ɩv�F��r7F�&�2�V'F�V�W2��F�&�Vv�F�f��R֖�W7F��W2�6V�BW���&F���֗76���2f�"f�&V�v����v�VFvR��"F�7F6�7'W6FW2v��7B&�f�6�f�Ɨ�F���2ࠢ��Р�22	���6��G&��2b��FW&f6P���7F����6��G&���FW67&�F�������������������������6�W&⢢�&�v�B�6Ɩ6��G&v�t4F�6���F�ǒ�f�vFR7&�72F�RV�F�&R&�6VGW&�v�&�B������6�W&�&&�B����VgB�6Ɩ6��G&v�&�FFRF�RW'7V7F�fR&�V�BF�R7W'&V�Bf�6����B������6V��W72���Ң����W6Rv�VV��f�V�BG&�6�F���g&���&&�F�6FV�ƗFRf�WrF�v�F�֖7&���WfV��7&�f�Wr������F�f��R��FW&7F��⢢��VgB�6Ɩ6��w&"���fR��"�6R7G'V7GW&W2�BV�F�F�W2������6��FW�B�V�R���&�v�B�6Ɩ6���V�6��FW�GV�7F����V�W2f�"&W6�W&6W2�'V��F��w2��B7&VGW&W2������Р��Ɩv��&6V�FW"#��#�t�C��W73��#�(	B6�RF�Rv�&�B�67V�B��W"F�F��'V�R��W"V��R����