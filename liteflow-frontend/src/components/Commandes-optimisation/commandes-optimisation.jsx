import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './commandes-optimisation.css';
import CustomDataGrid from '../CustomDataGrid/custom-datagrid.jsx';
import * as XLSX from 'xlsx';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'commande', headerName: 'Nom de la commande', width: 200 },
  { field: 'description', headerName: 'Description de la commande', width: 600 }
];

const rowsPowershell = [
  // Nettoyage de l'écran
  { id: 1, commande: 'clear', description: 'Nettoyer l\'écran du terminal PowerShell' },
  { id: 2, commande: 'cls', description: 'Alias de clear pour nettoyer l\'écran' },
  
  // Gestion des processus et CPU
  { id: 3, commande: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 20', description: 'Afficher les 20 processus consommant le plus de CPU' },
  { id: 4, commande: 'Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 20', description: 'Afficher les 20 processus consommant le plus de RAM' },
  { id: 5, commande: 'Get-Process | Where-Object {$_.CPU -gt 100}', description: 'Lister les processus utilisant plus de 100 secondes de CPU' },
  { id: 6, commande: 'Stop-Process -Name "nomprocessus" -Force', description: 'Forcer l\'arrêt d\'un processus par son nom' },
  { id: 7, commande: 'Stop-Process -Id PID -Force', description: 'Forcer l\'arrêt d\'un processus par son ID' },
  { id: 8, commande: 'Get-Process | Where-Object {$_.Responding -eq $false}', description: 'Identifier les processus qui ne répondent pas' },
  { id: 9, commande: 'Get-Process | Where-Object {$_.Responding -eq $false} | Stop-Process -Force', description: 'Arrêter tous les processus qui ne répondent pas' },
  { id: 10, commande: '$process = Get-Process notepad; $process.PriorityClass = "BelowNormal"', description: 'Réduire la priorité d\'un processus pour économiser les ressources' },
  { id: 11, commande: 'Get-Process | Group-Object -Property ProcessName | Sort-Object Count -Descending', description: 'Compter les instances de chaque processus en cours' },
  
  // Gestion des services
  { id: 12, commande: 'Get-Service | Where-Object {$_.Status -eq "Running"}', description: 'Lister tous les services actuellement en cours d\'exécution' },
  { id: 13, commande: 'Get-Service | Where-Object {$_.Status -eq "Running"} | Measure-Object', description: 'Compter le nombre de services en cours d\'exécution' },
  { id: 14, commande: 'Stop-Service -Name "nomservice" -Force', description: 'Arrêter immédiatement un service spécifique' },
  { id: 15, commande: 'Set-Service -Name "nomservice" -StartupType Disabled', description: 'Désactiver complètement le démarrage automatique d\'un service' },
  { id: 16, commande: 'Set-Service -Name "nomservice" -StartupType Manual', description: 'Configurer un service en démarrage manuel' },
  { id: 17, commande: 'Set-Service -Name "nomservice" -StartupType Automatic', description: 'Configurer un service en démarrage automatique' },
  { id: 18, commande: 'Get-Service | Where-Object {$_.StartType -eq "Automatic" -and $_.Status -eq "Stopped"}', description: 'Trouver les services automatiques qui sont arrêtés' },
  { id: 19, commande: 'Restart-Service -Name "nomservice" -Force', description: 'Redémarrer un service de force' },
  
  // Programmes au démarrage
  { id: 20, commande: 'Get-CimInstance Win32_StartupCommand', description: 'Lister tous les programmes qui se lancent au démarrage de Windows' },
  { id: 21, commande: 'Get-WmiObject Win32_StartupCommand | Select-Object Name, Command, Location', description: 'Afficher les détails des programmes au démarrage' },
  { id: 22, commande: 'Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"', description: 'Afficher les entrées de démarrage dans le registre utilisateur' },
  { id: 23, commande: 'Get-ItemProperty -Path "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"', description: 'Afficher les entrées de démarrage dans le registre système' },
  { id: 24, commande: 'Remove-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" -Name "NomApp"', description: 'Supprimer une application du démarrage automatique' },
  
  // Gestion des tâches planifiées
  { id: 25, commande: 'Get-ScheduledTask', description: 'Lister toutes les tâches planifiées du système' },
  { id: 26, commande: 'Get-ScheduledTask | Where-Object {$_.State -eq "Running"}', description: 'Afficher uniquement les tâches planifiées en cours d\'exécution' },
  { id: 27, commande: 'Get-ScheduledTask | Where-Object {$_.State -eq "Ready"}', description: 'Afficher les tâches planifiées prêtes à s\'exécuter' },
  { id: 28, commande: 'Disable-ScheduledTask -TaskName "NomTache"', description: 'Désactiver une tâche planifiée spécifique' },
  { id: 29, commande: 'Unregister-ScheduledTask -TaskName "NomTache" -Confirm:$false', description: 'Supprimer complètement une tâche planifiée' },
  { id: 30, commande: 'Get-ScheduledTask | Where-Object {$_.TaskName -like "*Update*"}', description: 'Trouver toutes les tâches de mise à jour' },
  
  // Optimisation du disque
  { id: 31, commande: 'Optimize-Volume -DriveLetter C -Defrag', description: 'Défragmenter le disque C (HDD uniquement)' },
  { id: 32, commande: 'Optimize-Volume -DriveLetter C -ReTrim', description: 'Optimiser un SSD avec la commande TRIM' },
  { id: 33, commande: 'Optimize-Volume -DriveLetter C -Analyze', description: 'Analyser la fragmentation d\'un volume sans le défragmenter' },
  { id: 34, commande: 'Get-Volume', description: 'Afficher l\'état, le système de fichiers et l\'espace de tous les volumes' },
  { id: 35, commande: 'Get-Volume | Select-Object DriveLetter, FileSystemLabel, Size, SizeRemaining', description: 'Afficher les détails d\'espace disque de tous les volumes' },
  { id: 36, commande: 'Get-PSDrive -PSProvider FileSystem', description: 'Lister tous les lecteurs de disque avec leur espace disponible' },
  
  // Nettoyage du disque
  { id: 37, commande: 'cleanmgr /sagerun:1', description: 'Exécuter le nettoyage de disque Windows avec configuration prédéfinie' },
  { id: 38, commande: 'cleanmgr /d C:', description: 'Lancer le nettoyage de disque pour le lecteur C' },
  { id: 39, commande: 'Clear-RecycleBin -Force', description: 'Vider complètement la corbeille sans demander de confirmation' },
  { id: 40, commande: 'Clear-RecycleBin -DriveLetter C -Force', description: 'Vider la corbeille uniquement pour le lecteur C' },
  { id: 41, commande: 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue', description: 'Supprimer tous les fichiers temporaires de l\'utilisateur' },
  { id: 42, commande: 'Remove-Item -Path "C:\\Windows\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue', description: 'Supprimer tous les fichiers temporaires Windows' },
  { id: 43, commande: 'Remove-Item -Path "C:\\Windows\\Prefetch\\*" -Force -ErrorAction SilentlyContinue', description: 'Vider le dossier Prefetch pour libérer de l\'espace' },
  { id: 44, commande: 'Dism.exe /online /Cleanup-Image /StartComponentCleanup', description: 'Nettoyer les anciens composants Windows (WinSxS)' },
  { id: 45, commande: 'Dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase', description: 'Nettoyage agressif des composants Windows avec suppression des sauvegardes' },
  { id: 46, commande: 'Dism.exe /online /Cleanup-Image /AnalyzeComponentStore', description: 'Analyser la taille du magasin de composants Windows' },
  
  // Cache et fichiers temporaires
  { id: 47, commande: 'Remove-Item -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer\\*.db" -Force', description: 'Supprimer le cache des miniatures Windows' },
  { id: 48, commande: 'ipconfig /flushdns', description: 'Vider le cache DNS pour améliorer la résolution réseau' },
  { id: 49, commande: 'Clear-DnsClientCache', description: 'Alternative PowerShell pour vider le cache DNS' },
  { id: 50, commande: 'Get-DnsClientCache', description: 'Afficher le contenu actuel du cache DNS' },
  
  // Gestion de la mémoire
  { id: 51, commande: 'Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum', description: 'Afficher la capacité totale de RAM installée' },
  { id: 52, commande: 'Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory', description: 'Afficher la mémoire totale et disponible en Ko' },
  { id: 53, commande: 'Get-Counter "\\Memory\\Available MBytes"', description: 'Afficher la quantité de mémoire disponible en temps réel' },
  { id: 54, commande: 'Get-Counter "\\Memory\\% Committed Bytes In Use"', description: 'Afficher le pourcentage d\'utilisation de la mémoire' },
  { id: 55, commande: '[System.GC]::Collect()', description: 'Forcer le garbage collector .NET à libérer la mémoire' },
  { id: 56, commande: 'Clear-Variable * -ErrorAction SilentlyContinue', description: 'Effacer toutes les variables PowerShell pour libérer la mémoire' },
  
  // Gestion du fichier d\'échange (pagefile)
  { id: 57, commande: 'Get-CimInstance Win32_PageFileUsage', description: 'Afficher l\'utilisation actuelle du fichier d\'échange' },
  { id: 58, commande: 'Get-CimInstance Win32_ComputerSystem | Select-Object AutomaticManagedPagefile', description: 'Vérifier si le fichier d\'échange est géré automatiquement' },
  
  // Réseau
  { id: 59, commande: 'Get-NetTCPConnection | Group-Object State, RemotePort | Sort-Object Count -Descending', description: 'Analyser les connexions réseau actives par état et port' },
  { id: 60, commande: 'Get-NetTCPConnection -State Established', description: 'Afficher uniquement les connexions TCP établies' },
  { id: 61, commande: 'Get-NetAdapter | Where-Object {$_.Status -eq "Up"}', description: 'Lister les adaptateurs réseau actifs' },
  { id: 62, commande: 'Disable-NetAdapter -Name "Nom" -Confirm:$false', description: 'Désactiver un adaptateur réseau spécifique' },
  { id: 63, commande: 'Enable-NetAdapter -Name "Nom"', description: 'Activer un adaptateur réseau' },
  { id: 64, commande: 'Restart-NetAdapter -Name "Nom"', description: 'Redémarrer un adaptateur réseau pour résoudre les problèmes' },
  { id: 65, commande: 'Get-NetAdapterStatistics', description: 'Afficher les statistiques de trafic réseau par carte' },
  { id: 66, commande: 'netsh int tcp set global autotuninglevel=normal', description: 'Optimiser la fenêtre de réception TCP pour de meilleures performances' },
  { id: 67, commande: 'netsh int tcp show global', description: 'Afficher les paramètres TCP globaux' },
  { id: 68, commande: 'netsh winsock reset', description: 'Réinitialiser la pile Winsock pour résoudre les problèmes réseau' },
  { id: 69, commande: 'netsh int ip reset', description: 'Réinitialiser la pile TCP/IP' },
  
  // Journaux et événements
  { id: 70, commande: 'Get-EventLog -LogName System -Newest 100 -EntryType Error', description: 'Afficher les 100 dernières erreurs du journal système' },
  { id: 71, commande: 'Get-EventLog -LogName Application -Newest 100 -EntryType Warning', description: 'Afficher les 100 derniers avertissements d\'applications' },
  { id: 72, commande: 'Get-WinEvent -FilterHashtable @{LogName="System"; Level=2}', description: 'Afficher toutes les erreurs critiques du système' },
  { id: 73, commande: 'Clear-EventLog -LogName System', description: 'Vider complètement le journal des événements système' },
  { id: 74, commande: 'Clear-EventLog -LogName Application', description: 'Vider le journal des événements applications' },
  { id: 75, commande: 'wevtutil el', description: 'Lister tous les journaux d\'événements disponibles' },
  { id: 76, commande: 'wevtutil cl System', description: 'Vider le journal système via l\'utilitaire wevtutil' },
  
  // Windows Update
  { id: 77, commande: 'Get-WindowsUpdate', description: 'Vérifier les mises à jour Windows disponibles (module PSWindowsUpdate requis)' },
  { id: 78, commande: 'Install-WindowsUpdate -AcceptAll -AutoReboot', description: 'Installer toutes les mises à jour Windows automatiquement' },
  { id: 79, commande: 'Get-HotFix', description: 'Lister tous les correctifs Windows installés' },
  { id: 80, commande: 'Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 10', description: 'Afficher les 10 derniers correctifs installés' },
  
  // Fonctionnalités Windows
  { id: 81, commande: 'Get-WindowsOptionalFeature -Online', description: 'Lister toutes les fonctionnalités Windows optionnelles' },
  { id: 82, commande: 'Get-WindowsOptionalFeature -Online | Where-Object {$_.State -eq "Enabled"}', description: 'Afficher uniquement les fonctionnalités activées' },
  { id: 83, commande: 'Disable-WindowsOptionalFeature -Online -FeatureName "NomFonctionnalite" -NoRestart', description: 'Désactiver une fonctionnalité Windows sans redémarrer' },
  { id: 84, commande: 'Enable-WindowsOptionalFeature -Online -FeatureName "NomFonctionnalite"', description: 'Activer une fonctionnalité Windows optionnelle' },
  { id: 85, commande: 'Get-WindowsCapability -Online', description: 'Lister toutes les capacités Windows disponibles' },
  
  // Programmes installés
  { id: 86, commande: 'Get-Package', description: 'Lister tous les programmes installés via Package Manager' },
  { id: 87, commande: 'Get-WmiObject -Class Win32_Product | Select-Object Name, Version', description: 'Lister tous les programmes installés via WMI' },
  { id: 88, commande: 'Uninstall-Package -Name "NomProgramme"', description: 'Désinstaller un programme spécifique' },
  { id: 89, commande: 'winget list', description: 'Lister les applications installées via Windows Package Manager' },
  { id: 90, commande: 'winget upgrade --all', description: 'Mettre à jour toutes les applications via winget' },
  
  // Vérification et réparation système
  { id: 91, commande: 'sfc /scannow', description: 'Analyser et réparer les fichiers système Windows corrompus' },
  { id: 92, commande: 'Dism /Online /Cleanup-Image /CheckHealth', description: 'Vérifier rapidement la santé de l\'image Windows' },
  { id: 93, commande: 'Dism /Online /Cleanup-Image /ScanHealth', description: 'Scanner l\'image Windows pour détecter les corruptions' },
  { id: 94, commande: 'Dism /Online /Cleanup-Image /RestoreHealth', description: 'Réparer l\'image Windows en utilisant Windows Update' },
  { id: 95, commande: 'chkdsk C: /F /R', description: 'Vérifier et réparer les erreurs du disque C (nécessite redémarrage)' },
  { id: 96, commande: 'Repair-Volume -DriveLetter C -Scan', description: 'Scanner un volume pour détecter les erreurs' },
  { id: 97, commande: 'Repair-Volume -DriveLetter C -OfflineScanAndFix', description: 'Réparer un volume hors ligne (nécessite redémarrage)' },
  
  // Performances et diagnostic
  { id: 98, commande: 'Get-ComputerInfo', description: 'Afficher toutes les informations détaillées sur l\'ordinateur' },
  { id: 99, commande: 'Get-ComputerInfo | Select-Object CsProcessors, OsTotalVisibleMemorySize, OsFreePhysicalMemory', description: 'Afficher les infos CPU et mémoire du système' },
  { id: 100, commande: 'systeminfo', description: 'Afficher les informations complètes du système Windows' },
  { id: 101, commande: 'Get-Counter "\\Processor(_Total)\\% Processor Time" -Continuous', description: 'Surveiller l\'utilisation CPU en temps réel' },
  { id: 102, commande: 'Get-Counter "\\PhysicalDisk(_Total)\\% Disk Time" -Continuous', description: 'Surveiller l\'utilisation du disque en temps réel' },
  { id: 103, commande: 'perfmon /report', description: 'Générer un rapport de diagnostic système complet (60 secondes)' },
  { id: 104, commande: 'perfmon', description: 'Ouvrir l\'analyseur de performances Windows' },
  
  // Gestion de l\'énergie
  { id: 105, commande: 'powercfg /energy', description: 'Générer un rapport d\'efficacité énergétique détaillé' },
  { id: 106, commande: 'powercfg /batteryreport', description: 'Générer un rapport sur l\'état de la batterie' },
  { id: 107, commande: 'powercfg /sleepstudy', description: 'Analyser les problèmes de veille moderne (Modern Standby)' },
  { id: 108, commande: 'powercfg /list', description: 'Lister tous les modes d\'alimentation disponibles' },
  { id: 109, commande: 'powercfg /setactive SCHEME_GUID', description: 'Activer un mode d\'alimentation spécifique par son GUID' },
  { id: 110, commande: 'powercfg /hibernate off', description: 'Désactiver l\'hibernation et supprimer hiberfil.sys' },
  { id: 111, commande: 'powercfg /hibernate on', description: 'Activer l\'hibernation' },
  { id: 112, commande: 'powercfg -h off', description: 'Alternative courte pour désactiver l\'hibernation' },
  
  // GPU et affichage
  { id: 113, commande: 'Get-WmiObject Win32_VideoController | Select-Object Name, DriverVersion, VideoMemoryType', description: 'Afficher les informations détaillées sur la carte graphique' },
  { id: 114, commande: 'Get-CimInstance Win32_VideoController', description: 'Obtenir les informations GPU via CIM' },
  { id: 115, commande: 'dxdiag', description: 'Ouvrir l\'outil de diagnostic DirectX' },
  
  // Pilotes
  { id: 116, commande: 'Get-WindowsDriver -Online', description: 'Lister tous les pilotes installés dans Windows' },
  { id: 117, commande: 'Get-WindowsDriver -Online | Where-Object {$_.ProviderName -ne "Microsoft"}', description: 'Afficher uniquement les pilotes tiers (non Microsoft)' },
  { id: 118, commande: 'pnputil /enum-drivers', description: 'Énumérer tous les pilotes dans le magasin de pilotes' },
  { id: 119, commande: 'pnputil /delete-driver oem##.inf /uninstall', description: 'Supprimer un pilote spécifique du magasin' },
  
  // Registre Windows
  { id: 120, commande: 'Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*"', description: 'Lister tous les programmes installés via le registre' },
  { id: 121, commande: 'Test-Path "HKLM:\\SOFTWARE\\Cle"', description: 'Vérifier si une clé de registre existe' },
  { id: 122, commande: 'New-Item -Path "HKLM:\\SOFTWARE\\Cle"', description: 'Créer une nouvelle clé de registre' },
  { id: 123, commande: 'Remove-Item -Path "HKLM:\\SOFTWARE\\Cle" -Recurse', description: 'Supprimer une clé de registre et ses sous-clés' },
  
  // Indexation Windows Search
  { id: 124, commande: 'Get-Service WSearch | Stop-Service', description: 'Arrêter le service d\'indexation Windows Search' },
  { id: 125, commande: 'Get-Service WSearch | Set-Service -StartupType Disabled', description: 'Désactiver l\'indexation Windows Search' },
  
  // SuperFetch / SysMain
  { id: 126, commande: 'Stop-Service "SysMain" -Force', description: 'Arrêter le service SuperFetch/SysMain' },
  { id: 127, commande: 'Set-Service "SysMain" -StartupType Disabled', description: 'Désactiver SuperFetch/SysMain (peut améliorer les performances sur SSD)' },
  
  // Windows Defender
  { id: 128, commande: 'Get-MpPreference', description: 'Afficher les paramètres de Windows Defender' },
  { id: 129, commande: 'Update-MpSignature', description: 'Mettre à jour les définitions de virus Windows Defender' },
  { id: 130, commande: 'Start-MpScan -ScanType QuickScan', description: 'Lancer une analyse rapide Windows Defender' },
  { id: 131, commande: 'Start-MpScan -ScanType FullScan', description: 'Lancer une analyse complète Windows Defender' },
  { id: 132, commande: 'Get-MpThreatDetection', description: 'Afficher les menaces détectées récemment' },
  
  // Firewall
  { id: 133, commande: 'Get-NetFirewallProfile', description: 'Afficher l\'état des profils de pare-feu Windows' },
  { id: 134, commande: 'Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True', description: 'Activer le pare-feu pour tous les profils' },
  { id: 135, commande: 'Get-NetFirewallRule | Where-Object {$_.Enabled -eq $true}', description: 'Lister toutes les règles de pare-feu actives' },
  
  // OneDrive
  { id: 136, commande: 'Stop-Process -Name "OneDrive" -Force -ErrorAction SilentlyContinue', description: 'Arrêter le processus OneDrive' },
  { id: 137, commande: 'taskkill /f /im OneDrive.exe', description: 'Forcer l\'arrêt de OneDrive via taskkill' },
  
  // Télémétrie et confidentialité
  { id: 138, commande: 'Get-Service DiagTrack | Stop-Service -Force', description: 'Arrêter le service de télémétrie Windows' },
  { id: 139, commande: 'Set-Service DiagTrack -StartupType Disabled', description: 'Désactiver la télémétrie Windows' },
  { id: 140, commande: 'Get-Service dmwappushservice | Stop-Service -Force', description: 'Arrêter le service WAP Push Message Routing' },
  { id: 141, commande: 'Set-Service dmwappushservice -StartupType Disabled', description: 'Désactiver le service WAP Push' },
  
  // Effets visuels
  { id: 142, commande: 'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" -Name "VisualFXSetting" -Value 2', description: 'Définir les effets visuels sur "Meilleure performance"' },
  
  // Compression de la mémoire
  { id: 143, commande: 'Get-MMAgent', description: 'Afficher l\'état de la compression de la mémoire et du prefetcher' },
  { id: 144, commande: 'Disable-MMAgent -MemoryCompression', description: 'Désactiver la compression de la mémoire' },
  { id: 145, commande: 'Enable-MMAgent -MemoryCompression', description: 'Activer la compression de la mémoire' },
  
  // Gestion des applications du Microsoft Store
  { id: 146, commande: 'Get-AppxPackage', description: 'Lister toutes les applications UWP installées' },
  { id: 147, commande: 'Get-AppxPackage | Where-Object {$_.Name -like "*nom*"}', description: 'Rechercher une application UWP spécifique' },
  { id: 148, commande: 'Get-AppxPackage *NomApp* | Remove-AppxPackage', description: 'Désinstaller une application UWP' },
  { id: 149, commande: 'Get-AppxPackage -AllUsers | Remove-AppxPackage', description: 'Supprimer les applications préinstallées pour tous les utilisateurs' },
  
  // Redémarrage et arrêt
  { id: 150, commande: 'Restart-Computer -Force', description: 'Redémarrer l\'ordinateur immédiatement sans confirmation' },
  { id: 151, commande: 'Stop-Computer -Force', description: 'Arrêter l\'ordinateur immédiatement' },
  { id: 152, commande: 'shutdown /r /t 0', description: 'Redémarrer immédiatement via la commande shutdown' },
  { id: 153, commande: 'shutdown /s /t 0', description: 'Arrêter immédiatement l\'ordinateur' },
  { id: 154, commande: 'shutdown /r /t 3600', description: 'Planifier un redémarrage dans 1 heure' },
  { id: 155, commande: 'shutdown /a', description: 'Annuler un redémarrage ou arrêt planifié' }
];

const rowsBash = [
  // Nettoyage de l'écran
  { id: 1, commande: 'clear', description: 'Nettoyer l\'écran du terminal bash' },
  { id: 2, commande: 'reset', description: 'Réinitialiser complètement le terminal' },
  { id: 3, commande: 'tput reset', description: 'Réinitialiser le terminal avec tput' },
  { id: 4, commande: 'ctrl+l', description: 'Raccourci clavier pour nettoyer l\'écran rapidement' },
  
  // Surveillance des processus en temps réel
  { id: 5, commande: 'top', description: 'Afficher les processus en temps réel avec utilisation CPU et mémoire (appuyer q pour quitter)' },
  { id: 6, commande: 'htop', description: 'Version améliorée et interactive de top avec interface colorée et intuitive (nécessite installation)' },
  { id: 7, commande: 'atop', description: 'Moniteur de performances avancé avec historique (nécessite installation)' },
  { id: 8, commande: 'glances', description: 'Outil de surveillance système complet avec interface web disponible (nécessite installation)' },
  { id: 9, commande: 'nmon', description: 'Moniteur de performances AIX/Linux avec interface ncurses (nécessite installation)' },
  { id: 10, commande: 'btop', description: 'Moniteur de ressources moderne avec interface graphique en terminal (nécessite installation)' },
  
  // Gestion des processus - Affichage et tri
  { id: 11, commande: 'ps aux', description: 'Afficher tous les processus en cours avec détails (utilisateur, PID, CPU, RAM)' },
  { id: 12, commande: 'ps aux --sort=-%cpu | head -n 21', description: 'Afficher les 20 processus consommant le plus de CPU' },
  { id: 13, commande: 'ps aux --sort=-%mem | head -n 21', description: 'Afficher les 20 processus consommant le plus de mémoire RAM' },
  { id: 14, commande: 'ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu | head', description: 'Format personnalisé avec PID parent et tri par CPU' },
  { id: 15, commande: 'ps -eo pid,user,args,etime | grep nom_processus', description: 'Rechercher un processus spécifique avec son temps d\'exécution' },
  { id: 16, commande: 'pstree', description: 'Afficher l\'arborescence complète des processus sous forme d\'arbre' },
  { id: 17, commande: 'pstree -p', description: 'Afficher l\'arborescence des processus avec leurs PIDs' },
  { id: 18, commande: 'pgrep nom_processus', description: 'Trouver le PID d\'un processus par son nom' },
  { id: 19, commande: 'pidof nom_processus', description: 'Afficher tous les PIDs d\'un processus en cours' },
  
  // Gestion des processus - Terminaison
  { id: 20, commande: 'kill PID', description: 'Envoyer le signal SIGTERM à un processus (arrêt gracieux)' },
  { id: 21, commande: 'kill -9 PID', description: 'Forcer l\'arrêt immédiat d\'un processus avec SIGKILL' },
  { id: 22, commande: 'kill -15 PID', description: 'Arrêt propre d\'un processus avec SIGTERM (équivalent à kill sans option)' },
  { id: 23, commande: 'killall nom_processus', description: 'Arrêter tous les processus portant un nom spécifique' },
  { id: 24, commande: 'killall -9 nom_processus', description: 'Forcer l\'arrêt de tous les processus d\'un nom donné' },
  { id: 25, commande: 'pkill nom_processus', description: 'Tuer les processus correspondant à un motif de nom' },
  { id: 26, commande: 'pkill -u utilisateur', description: 'Arrêter tous les processus d\'un utilisateur spécifique' },
  { id: 27, commande: 'pkill -9 -f "commande complète"', description: 'Forcer l\'arrêt des processus correspondant à une ligne de commande' },
  { id: 28, commande: 'xkill', description: 'Cliquer sur une fenêtre pour tuer son processus (nécessite X11)' },
  
  // Priorité des processus
  { id: 29, commande: 'nice -n 19 commande', description: 'Exécuter une commande avec la priorité la plus basse (-20 à 19, 19 = basse)' },
  { id: 30, commande: 'nice -n -20 commande', description: 'Exécuter avec la priorité la plus haute (nécessite root)' },
  { id: 31, commande: 'renice -n 10 -p PID', description: 'Modifier la priorité d\'un processus en cours d\'exécution' },
  { id: 32, commande: 'renice -n 19 -u utilisateur', description: 'Réduire la priorité de tous les processus d\'un utilisateur' },
  
  // Services système - systemd (distributions modernes)
  { id: 33, commande: 'systemctl list-units --type=service', description: 'Lister tous les services systemd et leur état' },
  { id: 34, commande: 'systemctl list-units --type=service --state=running', description: 'Afficher uniquement les services actuellement actifs' },
  { id: 35, commande: 'systemctl list-units --type=service --state=failed', description: 'Identifier les services qui ont échoué' },
  { id: 36, commande: 'systemctl status nom_service', description: 'Afficher l\'état détaillé et les logs récents d\'un service' },
  { id: 37, commande: 'systemctl start nom_service', description: 'Démarrer un service immédiatement' },
  { id: 38, commande: 'systemctl stop nom_service', description: 'Arrêter un service en cours d\'exécution' },
  { id: 39, commande: 'systemctl restart nom_service', description: 'Redémarrer un service (arrêt puis démarrage)' },
  { id: 40, commande: 'systemctl reload nom_service', description: 'Recharger la configuration d\'un service sans l\'arrêter' },
  { id: 41, commande: 'systemctl enable nom_service', description: 'Activer le démarrage automatique d\'un service au boot' },
  { id: 42, commande: 'systemctl disable nom_service', description: 'Désactiver le démarrage automatique d\'un service' },
  { id: 43, commande: 'systemctl is-enabled nom_service', description: 'Vérifier si un service démarre automatiquement' },
  { id: 44, commande: 'systemctl is-active nom_service', description: 'Vérifier si un service est actuellement actif' },
  { id: 45, commande: 'systemctl mask nom_service', description: 'Empêcher complètement le démarrage d\'un service (plus fort que disable)' },
  { id: 46, commande: 'systemctl unmask nom_service', description: 'Réactiver la possibilité de démarrer un service masqué' },
  { id: 47, commande: 'systemctl daemon-reload', description: 'Recharger la configuration systemd après modification de fichiers .service' },
  { id: 48, commande: 'systemctl list-dependencies nom_service', description: 'Afficher les dépendances d\'un service' },
  { id: 49, commande: 'systemctl list-unit-files --type=service', description: 'Lister tous les fichiers de services disponibles avec leur état' },
  
  // Services - SysV init (anciennes distributions)
  { id: 50, commande: 'service --status-all', description: 'Lister tous les services SysV et leur état (+/- pour actif/inactif)' },
  { id: 51, commande: 'service nom_service status', description: 'Vérifier l\'état d\'un service SysV' },
  { id: 52, commande: 'service nom_service start', description: 'Démarrer un service via SysV' },
  { id: 53, commande: 'service nom_service stop', description: 'Arrêter un service via SysV' },
  { id: 54, commande: 'service nom_service restart', description: 'Redémarrer un service via SysV' },
  { id: 55, commande: 'chkconfig --list', description: 'Lister les services au démarrage (Red Hat/CentOS)' },
  { id: 56, commande: 'chkconfig nom_service on', description: 'Activer un service au démarrage' },
  { id: 57, commande: 'chkconfig nom_service off', description: 'Désactiver un service au démarrage' },
  { id: 58, commande: 'update-rc.d nom_service defaults', description: 'Activer un service au démarrage (Debian/Ubuntu)' },
  { id: 59, commande: 'update-rc.d -f nom_service remove', description: 'Supprimer un service du démarrage (Debian/Ubuntu)' },
  
  // Analyse de l\'espace disque
  { id: 60, commande: 'df -h', description: 'Afficher l\'espace disque utilisé et disponible de tous les systèmes de fichiers montés' },
  { id: 61, commande: 'df -h /', description: 'Afficher l\'espace disque uniquement pour la partition racine' },
  { id: 62, commande: 'df -i', description: 'Afficher l\'utilisation des inodes (important pour détecter la saturation)' },
  { id: 63, commande: 'df -T', description: 'Afficher le type de système de fichiers pour chaque partition' },
  { id: 64, commande: 'du -sh /*', description: 'Afficher la taille de chaque répertoire à la racine' },
  { id: 65, commande: 'du -sh /* 2>/dev/null | sort -hr', description: 'Trier les répertoires par taille décroissante en supprimant les erreurs' },
  { id: 66, commande: 'du -sh /* | sort -hr | head -n 20', description: 'Afficher les 20 répertoires les plus volumineux à la racine' },
  { id: 67, commande: 'du -h --max-depth=1 /home | sort -hr', description: 'Analyser la taille des répertoires utilisateurs' },
  { id: 68, commande: 'du -ah /var/log | sort -hr | head -n 20', description: 'Trouver les 20 plus gros fichiers de logs' },
  { id: 69, commande: 'find / -type f -size +100M 2>/dev/null', description: 'Trouver tous les fichiers de plus de 100 Mo sur le système' },
  { id: 70, commande: 'find / -type f -size +1G 2>/dev/null', description: 'Trouver tous les fichiers de plus de 1 Go' },
  { id: 71, commande: 'find /home -type f -size +50M -exec ls -lh {} \\;', description: 'Lister les fichiers de plus de 50 Mo dans /home avec détails' },
  { id: 72, commande: 'ncdu /', description: 'Analyser l\'utilisation du disque de manière interactive avec ncurses (nécessite installation)' },
  { id: 73, commande: 'ncdu -x /', description: 'Analyser uniquement le système de fichiers courant sans traverser les montages' },
  { id: 74, commande: 'baobab', description: 'Analyseur d\'utilisation disque graphique pour GNOME' },
  
  // Gestion de la mémoire RAM et swap
  { id: 75, commande: 'free -h', description: 'Afficher l\'utilisation de la mémoire RAM et swap en format lisible' },
  { id: 76, commande: 'free -m', description: 'Afficher la mémoire en mégaoctets' },
  { id: 77, commande: 'free -g', description: 'Afficher la mémoire en gigaoctets' },
  { id: 78, commande: 'free -h -s 5', description: 'Surveiller la mémoire en temps réel avec rafraîchissement toutes les 5 secondes' },
  { id: 79, commande: 'cat /proc/meminfo', description: 'Afficher les informations détaillées sur la mémoire système' },
  { id: 80, commande: 'vmstat', description: 'Afficher les statistiques de mémoire virtuelle, swap et CPU' },
  { id: 81, commande: 'vmstat 1', description: 'Surveiller les statistiques système en temps réel chaque seconde' },
  { id: 82, commande: 'vmstat -s', description: 'Afficher les statistiques de mémoire détaillées' },
  { id: 83, commande: 'sync; echo 3 > /proc/sys/vm/drop_caches', description: 'Vider les caches mémoire (pagecache, dentries, inodes) - nécessite root' },
  { id: 84, commande: 'sync; echo 1 > /proc/sys/vm/drop_caches', description: 'Vider uniquement le page cache' },
  { id: 85, commande: 'swapon --show', description: 'Afficher les partitions/fichiers swap actifs' },
  { id: 86, commande: 'swapon -s', description: 'Afficher l\'utilisation du swap' },
  { id: 87, commande: 'swapoff -a', description: 'Désactiver tout le swap (nécessite root)' },
  { id: 88, commande: 'swapon -a', description: 'Activer tout le swap défini dans /etc/fstab' },
  { id: 89, commande: 'cat /proc/sys/vm/swappiness', description: 'Afficher la valeur actuelle de swappiness (0-100)' },
  { id: 90, commande: 'sysctl vm.swappiness=10', description: 'Réduire l\'utilisation du swap (10 = moins de swap, 60 = défaut)' },
  { id: 91, commande: 'echo "vm.swappiness=10" >> /etc/sysctl.conf', description: 'Rendre la modification de swappiness permanente' },
  
  // Nettoyage système - Fichiers temporaires
  { id: 92, commande: 'sudo rm -rf /tmp/*', description: 'Supprimer tous les fichiers temporaires dans /tmp' },
  { id: 93, commande: 'sudo rm -rf /var/tmp/*', description: 'Supprimer les fichiers temporaires persistants dans /var/tmp' },
  { id: 94, commande: 'sudo find /tmp -type f -atime +7 -delete', description: 'Supprimer les fichiers de /tmp non accédés depuis 7 jours' },
  { id: 95, commande: 'sudo tmpwatch 240 /tmp', description: 'Supprimer les fichiers de /tmp non modifiés depuis 240 heures (10 jours)' },
  
  // Nettoyage des logs
  { id: 96, commande: 'sudo journalctl --vacuum-time=7d', description: 'Supprimer les journaux systemd de plus de 7 jours' },
  { id: 97, commande: 'sudo journalctl --vacuum-size=500M', description: 'Limiter la taille totale des journaux à 500 Mo maximum' },
  { id: 98, commande: 'sudo journalctl --disk-usage', description: 'Afficher l\'espace disque utilisé par les journaux systemd' },
  { id: 99, commande: 'sudo du -sh /var/log', description: 'Afficher la taille totale du répertoire des logs' },
  { id: 100, commande: 'sudo find /var/log -type f -name "*.log" -mtime +30 -delete', description: 'Supprimer les fichiers .log de plus de 30 jours' },
  { id: 101, commande: 'sudo find /var/log -type f -name "*.gz" -delete', description: 'Supprimer tous les logs compressés archivés' },
  { id: 102, commande: 'sudo truncate -s 0 /var/log/syslog', description: 'Vider complètement un fichier log sans le supprimer' },
  { id: 103, commande: 'sudo logrotate -f /etc/logrotate.conf', description: 'Forcer la rotation des logs immédiatement' },
  { id: 104, commande: 'sudo rm -f /var/log/*.log.1', description: 'Supprimer les anciennes rotations de logs' },
  
  // Nettoyage APT (Debian/Ubuntu)
  { id: 105, commande: 'sudo apt update', description: 'Mettre à jour la liste des paquets disponibles' },
  { id: 106, commande: 'sudo apt upgrade', description: 'Mettre à jour tous les paquets installés vers leurs dernières versions' },
  { id: 107, commande: 'sudo apt full-upgrade', description: 'Mise à jour complète avec gestion intelligente des dépendances' },
  { id: 108, commande: 'sudo apt autoremove', description: 'Supprimer automatiquement les paquets inutilisés et leurs dépendances' },
  { id: 109, commande: 'sudo apt autoremove --purge', description: 'Supprimer les paquets inutilisés avec leurs fichiers de configuration' },
  { id: 110, commande: 'sudo apt autoclean', description: 'Supprimer les archives de paquets obsolètes du cache' },
  { id: 111, commande: 'sudo apt clean', description: 'Vider complètement le cache APT (/var/cache/apt/archives/)' },
  { id: 112, commande: 'du -sh /var/cache/apt/archives', description: 'Afficher la taille du cache APT' },
  { id: 113, commande: 'sudo apt-get install deborphan && deborphan', description: 'Identifier les paquets orphelins (sans dépendances)' },
  { id: 114, commande: 'sudo deborphan | xargs sudo apt-get -y remove --purge', description: 'Supprimer automatiquement tous les paquets orphelins' },
  { id: 115, commande: 'dpkg -l | grep "^rc" | awk \'{print $2}\' | xargs sudo apt-get purge -y', description: 'Purger les paquets désinstallés mais dont la config reste' },
  { id: 116, commande: 'sudo apt list --installed | wc -l', description: 'Compter le nombre de paquets installés' },
  
  // Nettoyage YUM/DNF (Red Hat/CentOS/Fedora)
  { id: 117, commande: 'sudo yum update', description: 'Mettre à jour tous les paquets YUM' },
  { id: 118, commande: 'sudo yum clean all', description: 'Nettoyer tous les caches YUM (metadata, paquets, etc.)' },
  { id: 119, commande: 'sudo yum autoremove', description: 'Supprimer les paquets inutilisés installés comme dépendances' },
  { id: 120, commande: 'sudo dnf update', description: 'Mettre à jour tous les paquets DNF (successeur de YUM)' },
  { id: 121, commande: 'sudo dnf clean all', description: 'Nettoyer complètement les caches DNF' },
  { id: 122, commande: 'sudo dnf autoremove', description: 'Supprimer les dépendances inutilisées avec DNF' },
  { id: 123, commande: 'sudo package-cleanup --oldkernels --count=2', description: 'Garder seulement les 2 derniers kernels (YUM)' },
  { id: 124, commande: 'sudo dnf remove --oldinstallonly --setopt installonly_limit=2 kernel', description: 'Garder seulement 2 kernels (DNF)' },
  
  // Analyse réseau
  { id: 125, commande: 'ip addr show', description: 'Afficher toutes les interfaces réseau et leurs adresses IP' },
  { id: 126, commande: 'ip link show', description: 'Afficher l\'état de toutes les interfaces réseau' },
  { id: 127, commande: 'ip route show', description: 'Afficher la table de routage IP' },
  { id: 128, commande: 'ifconfig', description: 'Afficher la configuration réseau (ancienne méthode)' },
  { id: 129, commande: 'netstat -tuln', description: 'Afficher tous les ports TCP/UDP en écoute' },
  { id: 130, commande: 'netstat -tulnp', description: 'Afficher les ports en écoute avec les PIDs des processus' },
  { id: 131, commande: 'ss -tuln', description: 'Alternative moderne à netstat pour afficher les sockets' },
  { id: 132, commande: 'ss -tulnp', description: 'Afficher les sockets avec les processus associés' },
  { id: 133, commande: 'ss -s', description: 'Afficher les statistiques résumées des sockets' },
  { id: 134, commande: 'lsof -i', description: 'Lister tous les fichiers et connexions réseau ouverts' },
  { id: 135, commande: 'lsof -i :80', description: 'Afficher les processus utilisant le port 80' },
  { id: 136, commande: 'lsof -i TCP', description: 'Afficher uniquement les connexions TCP ouvertes' },
  { id: 137, commande: 'netstat -s', description: 'Afficher les statistiques réseau détaillées par protocole' },
  { id: 138, commande: 'iftop', description: 'Surveiller la bande passante réseau en temps réel par connexion (nécessite installation)' },
  { id: 139, commande: 'nethogs', description: 'Afficher l\'utilisation de la bande passante par processus (nécessite installation)' },
  { id: 140, commande: 'nload', description: 'Visualiser le trafic réseau entrant/sortant en temps réel' },
  { id: 141, commande: 'vnstat', description: 'Surveiller la consommation de bande passante sur le long terme' },
  { id: 142, commande: 'tcpdump -i eth0', description: 'Capturer les paquets réseau sur l\'interface eth0' },
  { id: 143, commande: 'ping -c 4 google.com', description: 'Tester la connectivité réseau avec 4 paquets' },
  { id: 144, commande: 'traceroute google.com', description: 'Tracer le chemin des paquets vers une destination' },
  { id: 145, commande: 'mtr google.com', description: 'Combinaison de ping et traceroute en temps réel' },
  { id: 146, commande: 'host google.com', description: 'Résoudre un nom de domaine en adresse IP' },
  { id: 147, commande: 'dig google.com', description: 'Effectuer une requête DNS détaillée' },
  { id: 148, commande: 'nslookup google.com', description: 'Interroger les serveurs DNS pour résoudre un nom' },
  
  // Optimisation réseau
  { id: 149, commande: 'sudo ethtool eth0', description: 'Afficher les paramètres et statistiques d\'une interface réseau' },
  { id: 150, commande: 'sudo ethtool -s eth0 speed 1000 duplex full', description: 'Forcer une interface en 1000 Mbps full duplex' },
  { id: 151, commande: 'sudo ip link set eth0 mtu 9000', description: 'Augmenter le MTU à 9000 (Jumbo Frames) pour de meilleures performances' },
  { id: 152, commande: 'cat /proc/sys/net/ipv4/tcp_congestion_control', description: 'Afficher l\'algorithme de contrôle de congestion TCP actuel' },
  { id: 153, commande: 'sudo sysctl -w net.ipv4.tcp_congestion_control=bbr', description: 'Activer l\'algorithme BBR pour optimiser le débit TCP' },
  
  // Performance CPU
  { id: 154, commande: 'lscpu', description: 'Afficher les informations détaillées sur le(s) processeur(s)' },
  { id: 155, commande: 'cat /proc/cpuinfo', description: 'Afficher toutes les informations CPU depuis le kernel' },
  { id: 156, commande: 'nproc', description: 'Afficher le nombre de cœurs CPU disponibles' },
  { id: 157, commande: 'uptime', description: 'Afficher le temps de fonctionnement et la charge système moyenne' },
  { id: 158, commande: 'w', description: 'Afficher qui est connecté et la charge système' },
  { id: 159, commande: 'mpstat', description: 'Afficher les statistiques CPU par cœur (nécessite sysstat)' },
  { id: 160, commande: 'mpstat -P ALL 1', description: 'Surveiller l\'utilisation de tous les cœurs CPU chaque seconde' },
  { id: 161, commande: 'sar -u 1 10', description: 'Afficher l\'utilisation CPU toutes les secondes pendant 10 secondes' },
  { id: 162, commande: 'sar -P ALL 1', description: 'Surveiller chaque cœur CPU individuellement' },
  { id: 163, commande: 'cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor', description: 'Afficher le governor de fréquence CPU actuel' },
  { id: 164, commande: 'sudo cpupower frequency-set -g performance', description: 'Définir le governor CPU sur performance pour les performances maximales' },
  { id: 165, commande: 'sudo cpupower frequency-set -g powersave', description: 'Définir le governor sur powersave pour économiser l\'énergie' },
  { id: 166, commande: 'cpupower frequency-info', description: 'Afficher les informations sur la fréquence CPU et le scaling' },
  
  // Performance disque I/O
  { id: 167, commande: 'iostat', description: 'Afficher les statistiques d\'entrée/sortie CPU et disques' },
  { id: 168, commande: 'iostat -x 1', description: 'Afficher les statistiques I/O étendues en temps réel chaque seconde' },
  { id: 169, commande: 'iostat -dx 5', description: 'Statistiques I/O détaillées par appareil toutes les 5 secondes' },
  { id: 170, commande: 'iotop', description: 'Afficher l\'utilisation I/O disque par processus en temps réel (nécessite root)' },
  { id: 171, commande: 'sudo iotop -o', description: 'Afficher uniquement les processus effectuant des I/O actives' },
  { id: 172, commande: 'ioping -c 10 /', description: 'Tester la latence disque avec 10 pings' },
  { id: 173, commande: 'hdparm -t /dev/sda', description: 'Tester la vitesse de lecture d\'un disque' },
  { id: 174, commande: 'hdparm -T /dev/sda', description: 'Tester la vitesse de lecture du cache disque' },
  { id: 175, commande: 'sudo hdparm -i /dev/sda', description: 'Afficher les informations détaillées d\'un disque' },
  { id: 176, commande: 'dd if=/dev/zero of=testfile bs=1G count=1 oflag=direct', description: 'Tester la vitesse d\'écriture brute sur le disque' },
  { id: 177, commande: 'rm testfile', description: 'Supprimer le fichier de test créé pour le benchmark' }
];



function CommandesOptimisation() {
  const location = useLocation();
  const typeFromState = location.state?.type || 'Powershell';
  const [value, setValue] = React.useState(typeFromState === 'Powershell' ? 0 : 1);
  
  const [selectedIdsPowershell, setSelectedIdsPowershell] = React.useState([]);
  const [selectedRowsPowershell, setSelectedRowsPowershell] = React.useState([]);
  const [selectedIdsBash, setSelectedIdsBash] = React.useState([]);
  const [selectedRowsBash, setSelectedRowsBash] = React.useState([]);
  

  const handleClickDownload = (type) => {
    let selectedRows = [];
    let selectedIds = [];

    if (type === 'Powershell') {
      if (selectedIdsPowershell.length === 0) {
        alert("Aucune ligne sélectionnée pour Powershell !");
        return;
      }
      selectedRows = selectedRowsPowershell;
      selectedIds = selectedIdsPowershell;
    } else if (type === 'Bash') {
      if (selectedIdsBash.length === 0) {
        alert("Aucune ligne sélectionnée pour Bash !");
        return;
      }
      selectedRows = selectedRowsBash;
      selectedIds = selectedIdsBash;
    }

    // Créer une feuille de calcul à partir des données sélectionnées
    const ws = XLSX.utils.json_to_sheet(selectedRows);
    
    // Créer un classeur
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type === 'Powershell' ? 'Commandes Powershell' : 'Commandes Bash');
    
    // Télécharger le fichier
    XLSX.writeFile(wb, `commandes_${type.toLowerCase()}.xlsx`);
  };

  const handleSelectionChangePowershell = (ids, rows) => {
    console.log("Powershell - IDs sélectionnés :", ids);
    console.log("Powershell - Lignes sélectionnées :", rows);
    setSelectedIdsPowershell(ids);
    setSelectedRowsPowershell(rows);
  };

  const handleSelectionChangeBash = (ids, rows) => {
    console.log("Bash - IDs sélectionnés :", ids);
    console.log("Bash - Lignes sélectionnées :", rows);
    setSelectedIdsBash(ids);
    setSelectedRowsBash(rows);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div>
      <svg id="btn-back" onClick={handleBack} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <path d="M236.3 107.1C247.9 96 265 92.9 279.7 99.2C294.4 105.5 304 120 304 136L304 272.3L476.3 107.2C487.9 96 505 92.9 519.7 99.2C534.4 105.5 544 120 544 136L544 504C544 520 534.4 534.5 519.7 540.8C505 547.1 487.9 544 476.3 532.9L304 367.7L304 504C304 520 294.4 534.5 279.7 540.8C265 547.1 247.9 544 236.3 532.9L44.3 348.9C36.5 341.3 32 330.9 32 320C32 309.1 36.5 298.7 44.3 291.1L236.3 107.1z"/>
      </svg>

      <div className='container-download-btn'>
        <div className="item-dowload-btn">
          Powershell
          <svg className="btn-dowload-xlsx" onClick={() => handleClickDownload("Powershell")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z"/>
          </svg>
        </div>
        <div className="item-dowload-btn">
          Bash
          <svg className="btn-dowload-xlsx" onClick={() => handleClickDownload("Bash")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z"/>
          </svg>
        </div>
      </div>

      <Tabs value={value} onChange={handleChange}>
        <Tab label="Powershell" />
        <Tab label="Bash" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {value === 0 && (
          <div>
            <CustomDataGrid
              rows={rowsPowershell}
              columns={columns}
              onSelectionChange={handleSelectionChangePowershell}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              paperProps={{ sx: { height: '65vh', width: '100%', position: 'relative', marginTop: '20px' } }}
            />
          </div>
        )}
        {value === 1 && (
          <div>
            <CustomDataGrid
              rows={rowsBash}
              columns={columns}
              onSelectionChange={handleSelectionChangeBash}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              paperProps={{ sx: { height: '65vh', width: '100%', position: 'relative', marginTop: '20px' } }}
            />
          </div>
        )}
      </Box>
    </div>
  );
}

export default CommandesOptimisation;