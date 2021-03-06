![GitHub package.json version](https://img.shields.io/github/package-json/v/anyopsos/anyopsos)
![GitHub](https://img.shields.io/github/license/anyopsos/anyopsos)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3379512d71dc479fb65a839b6c409592)](https://www.codacy.com/gh/anyOpsOS/anyOpsOS?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=anyOpsOS/anyOpsOS&amp;utm_campaign=Badge_Grade)
![GitHub issues](https://img.shields.io/github/issues/anyopsos/anyopsos)

![App State](https://img.shields.io/badge/state-alpha-red?style=for-the-badge)


# anyOpsOS

anyOpsOS started as a fun/test project and I realized that it can be a good tool to manage my GNU/Linux infrastructure. But finally I opted to do something which not require any Agent to **manage the whole infrastructure of a business**.

The main purpose of this project is to create a tool to: **do disaster recovery tasks, monitor, install, manage and preconfigure any kind of system and it's services, reports...**

Think of any tool that you use as daily basis, this project must have a similar one to do the same job. And just because all the different tools share it's information you will be more powerful than ever.

**No installation is required on managed infrastructure. AGENT FREE!**

###### As an example,
If we manage all our VMWare infrastructure with `Infrastructure Manager` App and integrate all the data with the `Monitor` App, automatically we can have full performance charts of all it's VMs.

Now we integrate our physical Storage Systems (like NetApp/EMC...) to `Infrastructure Manager`, we can control performance issues with `Monitor` and automatically link it to VMWare VMs IOPS/IOwaits issues. Or with `Backups Manager` we can perform Storage Snapshots, Instant VM Recovery, File Recovery and much more.

But... why not integrate it to Ansible, Terraform and many others to work as GitOps method with `Notepad`?

Or just open a SSH shell with `SSH` or maybe... upload/download files with `SFTP` to these VMs.

As said, same with PCI Compliance checks, services management, security audits...

---

> This project is for ProdOps, DevOps, NetOps, SecOps... people, yeah; anyOps

## Installation

This project provides a series of Dockerfiles under [/docker](docker/)

#### Development

Follow the procedure from [Development](docs/Development.md)

#### Production

Follow the procedure from [Production](docs/Production.md)

## Architecture

![](docs/assets/architecture/architecture.png)

## Roadmap

[ROADMAP.md](ROADMAP.md)

Don't hesitate to provide a Logo and Backgrounds :)

## Currently installed applications

![alt text](https://isartnavarro.io/img/anyOpsOS/smanager_app.png "Infrastructure Manager app")

- Credentials Manager
    - Manage all your `anyOpsOS` credentials to use in other installed applications.
- Infrastructure Manager
    - Full integration with `VMware vCenter`/`ESXi` nodes and `VM`s.
    - Full integration with `NetApp` storage.
    - Full integration with `K8s` and `Docker`.
    - Manage all your standalone nodes (`Linux`, `Windows` and `SNMP`).
    - Generate `PCI Compilance` reports
- Infrastructure as Code
    - Full integration with `Ansible`.
    - Full integration with `Terraform`.
- VMware Remote Console
    - Connect to any managed Virtual Machine!
- Backups Manager
    - Restore `NetApp Snapshots` into `Instant Virtual Machines`.
    - Restore `VM Guest files` from `NetApp Snapshots`.
    - Mount `NetApp Snapshots` into your managed `ESXi` hosts.
    - Restore `vCenter Datastore files` from `NetApp Snapshots`.
    - Create Backup Jobs
        - `NetApp Snapshots/SnapMirror/SnapVault` of your `vCenter/ESXi` infrastructure.
        - `MySQL`/`MariaDB`.
        - ... more comming
- Datastore Explorer
    - Manage `VMware Datastores` files.
    - Manage `NetApp Volumes` files.
- File Explorer
    - Manage all your `anyOpsOS` files
    - Download files to `anyOpsOS` from URL
    - Download `anyOpsOS` files to your local OS.
- SFTP
    - Download/upload files to any SFTP server (SSH).
    - Execute scripts in remote nodes.
    - Download files from URL to remote nodes.
- SSH shell
    - Connect to any SSH server instance.
- Monitor
    - Full integration with `Netdata`.
    - Monitor in real time all managed nodes (physical and virtual).
    - Alerts...
- Drawer
    - Full integration of `draw.io`.
- Notepad
    - Full integration of `Theia`.

![alt text](https://isartnavarro.io/img/anyOpsOS/sftp_app.png "SFTP app")




## Acknowledgments

[<img src="docs/assets/jetbrains.png" width="100">](https://www.jetbrains.com/?from=anyOpsOS)
