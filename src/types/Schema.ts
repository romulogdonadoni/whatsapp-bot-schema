export const SchemaJson: FlowConfig = {
    "flows": [
        {
            "key": "Inicio",
            "blocks": [
                {
                    "key": "inicio.termos",
                    "type": "CONDITION",
                    "isFirst": true,
                    "conditions": [
                        {
                            "next": "inicio.bemvindo",
                            "condition": {
                                "key": {
                                    "key": "database.aceite_termos",
                                    "type": "DATABASE"
                                },
                                "type": "EQUAL",
                                "value": "1"
                            }
                        },
                        {
                            "next": "inicio.termos.mensagem",
                            "condition": {
                                "key": {
                                    "key": "database.aceite_termos",
                                    "type": "DATABASE"
                                },
                                "type": "NOT_EQUAL",
                                "value": "1"
                            }
                        }
                    ]
                },
                {
                    "key": "inicio.termos.mensagem",
                    "next": "inicio.termos.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Olá! 👋 Bem-vindo(a) ao Hospital Ernesto Dornelles. Antes de iniciarmos seu atendimento, por favor, aceite a política de privacidade disponível no link abaixo:\n\nhttps://cos-avh.s3.us-south.cloud-object-storage.appdomain.cloud/Termo_Consentimento_Privacidade.pdf\n\nVocê aceita os termos?\n\nSelecione o número da opção desejada:\n\n1 - Sim\n2 - Não"
                            }
                        ]
                    }
                },
                {
                    "key": "inicio.termos.input",
                    "type": "INPUT",
                    "input": {
                        "regex": "^[12]$",
                        "variable": {
                            "key": "aceite_termos",
                            "type": "DATABASE"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "inicio.bemvindo"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "inicio.termos.recusados"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "inicio.termos.input.erro"
                    }
                },
                {
                    "key": "inicio.termos.input.erro",
                    "next": "inicio.termos",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "inicio.termos.recusados",
                    "next": "inicio.termos",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Infelizmente, não podemos prosseguir com o atendimento sem que aceite dos termos de privacidade. Se mudar de ideia, por favor, inicie um novo atendimento."
                            }
                        ]
                    }
                },
                {
                    "key": "inicio.bemvindo",
                    "next": "inicio.input",
                    "type": "MESSAGE",
                    "isFirst": true,
                    "message": {
                        "contents": [
                            {
                                "value": "Por aqui posso te ajudar com diversos assuntos. Vamos lá....\n\nSelecione o número da opção desejada:\n\n1 - Agendamento de Consultas\n2 - Sobre Meu Agendamento (confirmar / desmarcar)\n3 - Para informações de Exames\n4 - Agendamentos de Oftalmologia\n5 - Informações sobre Visitas\n6 - Localização\n7 - Outras informações\n\n"
                            }
                        ]
                    }
                },
                {
                    "key": "inicio.input",
                    "type": "INPUT",
                    "input": {
                        "regex": "^[1-7]$",
                        "variable": {
                            "key": "selected",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "pessoa.cadastro.nome"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "consulta.protocolo"
                                }
                            },
                            {
                                "value": "3",
                                "action": {
                                    "type": "GOTO",
                                    "value": "exames.menu"
                                }
                            },
                            {
                                "value": "4",
                                "action": {
                                    "type": "GOTO",
                                    "value": "oftalmologia.info"
                                }
                            },
                            {
                                "value": "5",
                                "action": {
                                    "type": "GOTO",
                                    "value": "visit.information"
                                }
                            },
                            {
                                "value": "6",
                                "action": {
                                    "type": "GOTO",
                                    "value": "localizacao"
                                }
                            },
                            {
                                "value": "7",
                                "action": {
                                    "type": "GOTO",
                                    "value": "others.information"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "inicio.input.erro"
                    }
                },
                {
                    "key": "inicio.input.erro",
                    "next": "inicio.bemvindo",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "localizacao",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "📍 *Localização do Hospital Ernesto Dornelles*\n\n🏥 Endereço:\nAv. Ipiranga, 1801 - Azenha\nPorto Alegre - RS, 90160-092\n\n🗺️ Mapa: https://maps.app.goo.gl/j98erAdNf6XBZmMi9\n\n🚗 Clique no link acima para abrir o mapa e obter direções.\n\nSe precisar de ajuda, por favor, entre em contato novamente direto com um de nossos atendentes."
                            }
                        ]
                    }
                },
                {
                    "key": "visit.information",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "📅 Horários de visitas:\n\nUCE (01 Familiar):\n10:00 às 10:30 / 16:00 às 16:30\n\nEmergência (01 Familiar):\n\nLeitos Pares: 11:00 às 11:20\nLeitos Ímpares: 15:00 às 15:20\nUTI (02 Familiares):\n\nLeitos Pares: 10:00 às 10:30 / 16:00 às 16:30 / 19:30 às 20:00\nUnidade de Internação (02 Familiares, 01 por vez):\n08:00 às 21:00 (Permanência de 30 minutos)"
                            }
                        ]
                    }
                },
                {
                    "key": "oftalmologia.info",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Retornar ao menu anterior.\n\nPara agendamento de Oftalmologia, entre em contato com a Sulvision: 📞 (51) 3282-2207 ou WhatsApp (51) 98517-1014"
                            }
                        ]
                    }
                }
            ],
            "description": "Fluxo inicial"
        },
        {
            "key": "Exames de imagens",
            "blocks": [
                {
                    "key": "exames.menu",
                    "next": "exames.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "🔬 Exames\n\nSelecione o número da opção desejada:\n\n0 - Voltar\n1 - Exames Laboratoriais\n2 - Exames de Imagem"
                            }
                        ]
                    }
                },
                {
                    "key": "exames.input",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "inicio.bemvindo"
                        },
                        "regex": "^[1-3]$",
                        "variable": {
                            "key": "selected_exam",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "exames.laboratoriais"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "exames.imagem"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "exames.input.invalid.option"
                    }
                },
                {
                    "key": "exames.input.invalid.option",
                    "next": "exames.menu",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "exames.laboratoriais",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "🧪 Exames Laboratoriais\n\nOlá! Este canal é exclusivo para marcação de consultas.\n\nPara melhor atendê-lo, por favor, entre em contato diretamente com o setor correspondente ao seu atendimento:\n\n📞 Laboratório Telefone e WhatsApp: (51) 3217-8877\n\nAgradecemos a sua compreensão e estamos à disposição para qualquer dúvida."
                            }
                        ]
                    }
                },
                {
                    "key": "exames.imagem",
                    "next": "exames.imagem.selecionar",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "🖼️ Exames de Imagem\n\nSelecione o número da opção desejada:\n\n0 - Voltar\n1 - SIDI\n2 - Nuclimagem\n3 - Endoscopia/Colonoscopia "
                            }
                        ]
                    }
                },
                {
                    "key": "exames.imagem.selecionar",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "exames.menu"
                        },
                        "regex": "^[1-3]$",
                        "variable": {
                            "key": "selected_imagem",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "imagem.sidi"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "imagem.nuclimagem"
                                }
                            },
                            {
                                "value": "3",
                                "action": {
                                    "type": "GOTO",
                                    "value": "imagem.endoscopia"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "exames.imagem.selecionar.invalid"
                    }
                },
                {
                    "key": "exames.imagem.selecionar.invalid",
                    "next": "exames.imagem",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "imagem.sidi",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "📷 SIDI\n\nOlá! Este canal é exclusivo para marcação de consultas.\n\nA unidade SIDI localizada no HED realiza os seguintes exames: Ressonância Magnética Fechada, Mamografia,Ecografia, Tomografia Computadorizada, Raios X e Ecocardiografia\n\nEntre em contato diretamente com o setor correspondente ao seu atendimento:\n📞 Exames SIDI Geral: (51) 3230-9168\n📞 Exames SIDI Raio X: (51) 3217-8609\n📞 Exames SIDI Ressonância Magnética: (51) 3230-9141\n\nAgradecemos a sua compreensão e estamos à disposição para qualquer dúvida."
                            }
                        ]
                    }
                },
                {
                    "key": "imagem.nuclimagem",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "📷 Nuclimagem\n\nOlá! Este canal é exclusivo para marcação de consultas.\n\nEntre em contato diretamente com o setor correspondente ao seu atendimento:\n\n📞 Nuclimagem: (51) 3217-2666\n\nAgradecemos a sua compreensão e estamos à disposição para qualquer dúvida."
                            }
                        ]
                    }
                },
                {
                    "key": "imagem.endoscopia",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "📷 Endoscopia/Colonoscopia\n\nOlá! Este canal é exclusivo para marcação de consultas.\n\nEntre em contato diretamente com o setor correspondente ao seu atendimento:\n\n📞 Centro de Saúde Digestiva Telefone e WhatsApp: (51) 3217-8885\n\nAgradecemos a sua compreensão e estamos à disposição para qualquer dúvida."
                            }
                        ]
                    }
                }
            ],
            "description": ""
        },
        {
            "key": "Meus Agendamentos",
            "blocks": [
                {
                    "key": "consulta.protocolo",
                    "next": "consulta.protocolo.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Voltar\n\nPor favor, informe o número do protocolo do agendamento:"
                            }
                        ]
                    }
                },
                {
                    "key": "consulta.protocolo.input",
                    "next": "consulta.cpf",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "inicio.bemvindo"
                        },
                        "regex": "^[0-9]{9}$",
                        "variable": {
                            "key": "protocolo",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [],
                        "regexDontMatchBlock": "consulta.protocolo.input.invalid"
                    }
                },
                {
                    "key": "consulta.protocolo.input.invalid",
                    "next": "consulta.protocolo.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "O número do protocolo deve ter 9 digitos numéricos. \n\nExemplo: *123456789*\n\n0 - Voltar"
                            }
                        ]
                    }
                },
                {
                    "key": "consulta.cpf",
                    "next": "consulta.cpf.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Voltar\n\nInforme seu CPF (apenas números):"
                            }
                        ]
                    }
                },
                {
                    "key": "consulta.cpf.input",
                    "next": "consulta.buscar",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "consulta.protocolo"
                        },
                        "regex": "^[0-9]{11}$",
                        "variable": {
                            "key": "cpf",
                            "type": "MEMORY"
                        },
                        "validator": "cpf",
                        "conditions": [],
                        "regexDontMatchBlock": "consulta.cpf.input.erro"
                    }
                },
                {
                    "key": "consulta.cpf.input.erro",
                    "next": "consulta.cpf.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "CPF inválido. Por favor, digite apenas os 11 números do seu CPF, sem pontos ou traços.\n\n0 - Voltar"
                            }
                        ]
                    }
                },
                {
                    "key": "consulta.nascimento",
                    "next": "consulta.nascimento.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Voltar\n\nPor fim, informe sua data de nascimento (formato DD/MM/AAAA):"
                            }
                        ]
                    }
                },
                {
                    "key": "consulta.nascimento.input",
                    "next": "consulta.buscar",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "consulta.cpf"
                        },
                        "regex": "^\\d{2}/\\d{2}/\\d{4}$",
                        "variable": {
                            "key": "nascimento",
                            "type": "MEMORY"
                        },
                        "validator": "birthdate",
                        "conditions": [],
                        "regexDontMatchBlock": "consulta.nascimento.input.regex.erro"
                    }
                },
                {
                    "key": "consulta.nascimento.input.regex.erro",
                    "next": "consulta.nascimento.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Data de nascimento inválida. Por favor, informe a data no formato DD/MM/AAAA.\n\n0 - Voltar"
                            }
                        ]
                    }
                },
                {
                    "key": "consulta.buscar",
                    "next": "consulta.resultado",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/appointment/by-infos?appointmentId=${memory.protocolo}&document=${memory.cpf}",
                        "body": "",
                        "type": "GET",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "meus.agendamentos.selecionarId"
                                },
                                "status": 200,
                                "saveResponse": true
                            }
                        ]
                    }
                },
                {
                    "key": "meus.agendamentos.selecionarId",
                    "type": "ACTION",
                    "action": {
                        "next": "meus.agendamentos.selecionarText",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "appointmentId",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "id",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "meus.agendamentos.selecionarText",
                    "type": "ACTION",
                    "action": {
                        "next": "meus.agendamentos.selecionarStatus",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "appointmentDescription",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "name",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "meus.agendamentos.selecionarStatus",
                    "type": "ACTION",
                    "action": {
                        "next": "meus.agendamentos.status_conditions",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "appointmentStatus",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "values.status",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "meus.agendamentos.status_conditions",
                    "type": "CONDITION",
                    "conditions": [
                        {
                            "next": "meus.agendamentos.exibir",
                            "condition": {
                                "key": {
                                    "key": "memory.appointmentStatus",
                                    "type": "MEMORY"
                                },
                                "type": "EQUAL",
                                "value": "SCHEDULED"
                            }
                        },
                        {
                            "next": "meus.agendamentos.exibir.confirmado",
                            "condition": {
                                "key": {
                                    "key": "memory.appointmentStatus",
                                    "type": "MEMORY"
                                },
                                "type": "EQUAL",
                                "value": "CONFIRMED"
                            }
                        },
                        {
                            "next": "meus.agendamentos.exibir.cancelado",
                            "condition": {
                                "key": {
                                    "key": "memory.appointmentStatus",
                                    "type": "MEMORY"
                                },
                                "type": "EQUAL",
                                "value": "CANCELED"
                            }
                        }
                    ]
                },
                {
                    "key": "meus.agendamentos.exibir",
                    "next": "meus.agendamentos.opcoes",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Seu agendamento:\n${memory.appointmentDescription}\n\nO que deseja fazer?\n\nSelecione o número da opção desejada:\n\n0 - Voltar\n1 - Confirmar consulta\n2 - Cancelar consulta\n3 - Reagendar consulta\n4 - Falar com atendente"
                            }
                        ]
                    },
                    "useMemory": true
                },
                {
                    "key": "meus.agendamentos.opcoes",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "inicio.bemvindo"
                        },
                        "regex": "^[1-5]$",
                        "variable": {
                            "key": "opcao_agendamento",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "meus.agendamentos.confirmar"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "meus.agendamentos.cancelar.mensagem"
                                }
                            },
                            {
                                "value": "3",
                                "action": {
                                    "type": "START_PROTOCOL"
                                }
                            },
                            {
                                "value": "4",
                                "action": {
                                    "type": "START_PROTOCOL"
                                }
                            },
                            {
                                "value": "5",
                                "action": {
                                    "type": "GOTO",
                                    "value": "inicio.bemvindo"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "meus.agendamentos.opcoes.invalid"
                    }
                },
                {
                    "key": "meus.agendamentos.opcoes.invalid",
                    "next": "meus.agendamentos.exibir",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida. Por favor, selecione uma opção válida."
                            }
                        ]
                    }
                },
                {
                    "key": "meus.agendamentos.cancelar",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Sua consulta foi cancelada. \n\nPara outra solicitação, entre em contato novamente."
                            }
                        ]
                    }
                },
                {
                    "key": "meus.agendamentos.confirmar",
                    "next": "meus.agendamentos.confirmar.mensagem",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/appointment/${memory.appointmentId}/confirm",
                        "body": "",
                        "type": "OPTIONS",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "meus.agendamentos.confirmar.mensagem"
                                },
                                "status": 200
                            }
                        ]
                    }
                },
                {
                    "key": "meus.agendamentos.confirmar.mensagem",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Sua consulta foi confirmada com sucesso. \n\nHED agradece a sua preferência, até breve!"
                            }
                        ]
                    }
                },
                {
                    "key": "meus.agendamentos.exibir.confirmado",
                    "next": "meus.agendamentos.opcoes.confirmado",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Seu agendamento:\n${memory.appointmentDescription}\n\nO que deseja fazer?\n\nSelecione o número da opção desejada:\n\n0 - Voltar\n\n1 - Cancelar consulta\n2 - Reagendar consulta\n3 - Falar com atendente\n4 - Voltar ao menu principal"
                            }
                        ]
                    },
                    "useMemory": true
                },
                {
                    "key": "meus.agendamentos.opcoes.confirmado",
                    "type": "INPUT",
                    "input": {
                        "regex": "^[1-4]$",
                        "variable": {
                            "key": "opcao_agendamento_confirmado",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "meus.agendamentos.cancelar.mensagem"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "START_PROTOCOL"
                                }
                            },
                            {
                                "value": "3",
                                "action": {
                                    "type": "START_PROTOCOL"
                                }
                            },
                            {
                                "value": "4",
                                "action": {
                                    "type": "GOTO",
                                    "value": "inicio.bemvindo"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "meus.agendamentos.opcoes.confirmado.invalid"
                    }
                },
                {
                    "key": "meus.agendamentos.opcoes.confirmado.invalid",
                    "next": "meus.agendamentos.exibir.confirmado",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida. Por favor, selecione uma opção válida."
                            }
                        ]
                    }
                },
                {
                    "key": "meus.agendamentos.exibir.cancelado",
                    "next": "meus.agendamentos.opcoes.cancelado",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Seu agendamento:\n${memory.appointmentDescription}\n\nO que deseja fazer?\n\nSelecione o número da opção desejada:\n\n0 - Voltar\n\n1 - Falar com atendente\n2 - Voltar ao menu principal"
                            }
                        ]
                    },
                    "useMemory": true
                },
                {
                    "key": "meus.agendamentos.opcoes.cancelado",
                    "type": "INPUT",
                    "input": {
                        "regex": "^[1-2]$",
                        "variable": {
                            "key": "opcao_agendamento_cancelado",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "START_PROTOCOL"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "inicio.bemvindo"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "meus.agendamentos.opcoes.cancelado.invalid"
                    }
                },
                {
                    "key": "meus.agendamentos.opcoes.cancelado.invalid",
                    "next": "meus.agendamentos.exibir.cancelado",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida. Por favor, selecione uma opção válida."
                            }
                        ]
                    }
                }
            ],
            "description": "Fluxo de gerenciamento de agendamentos"
        },
        {
            "key": "meus.agendamentos.cancelar_flow",
            "blocks": [
                {
                    "key": "meus.agendamentos.cancelar.mensagem",
                    "next": "meus.agendamentos.cancelar.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Tem certeza que deseja cancelar o agendamento?\n\nSelecione o número da opção desejada:\n\n0 - Voltar\n\n1 - Sim\n2 - Não"
                            }
                        ]
                    }
                },
                {
                    "key": "meus.agendamentos.cancelar.input",
                    "type": "INPUT",
                    "input": {
                        "regex": "^[1-2]$",
                        "variable": {
                            "key": "cancelar_agendamento",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "meus.agendamentos.cancelar.sim"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "meus.agendamentos.cancelar.nao"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "meus.agendamentos.cancelar.input.invalid"
                    }
                },
                {
                    "key": "meus.agendamentos.cancelar.input.invalid",
                    "next": "meus.agendamentos.cancelar.mensagem",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida. Por favor, selecione uma opção válida."
                            }
                        ]
                    }
                },
                {
                    "key": "meus.agendamentos.cancelar.sim",
                    "next": "meus.agendamentos.cancelar.processando",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Estamos processando o cancelamento do seu agendamento. Por favor, aguarde alguns instantes."
                            }
                        ]
                    }
                },
                {
                    "key": "meus.agendamentos.cancelar.processando",
                    "next": "inicio.bemvindo",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/appointment/${memory.appointmentId}/cancel",
                        "body": "",
                        "type": "OPTIONS",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "meus.agendamentos.cancelar.processado"
                                },
                                "status": 200
                            },
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "meus.agendamentos.cancelar.nao"
                                },
                                "status": 400
                            }
                        ]
                    }
                },
                {
                    "key": "meus.agendamentos.cancelar.processado",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Sua consulta foi cancelada com sucesso. \n\nPara outra solicitação, entre em contato novamente."
                            }
                        ]
                    }
                },
                {
                    "key": "meus.agendamentos.cancelar.nao",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Entendido, caso mude de ideia, você pode cancelar o agendamento a qualquer momento."
                            }
                        ]
                    }
                }
            ],
            "description": ""
        },
        {
            "key": "Cadastro pessoa",
            "blocks": [
                {
                    "key": "pessoa.cadastro.termos",
                    "next": "pessoa.cadastro.termos.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Antes de iniciarmos o cadastro, precisamos que você leia e aceite nossos termos de privacidade, conforme a LGPD. Você concorda com os termos?\n\nhttps://cos-avh.s3.us-south.cloud-object-storage.appdomain.cloud/Termo_Consentimento_Privacidade.pdf\n\nSelecione o número da opção desejada:\n\n1 - Sim\n2 - Não"
                            }
                        ]
                    }
                },
                {
                    "key": "pessoa.cadastro.termos.input",
                    "type": "INPUT",
                    "input": {
                        "regex": "",
                        "variable": {
                            "key": "aceite_termos",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "pessoa.cadastro.nome"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "pessoa.cadastro.termos.recusados"
                                }
                            }
                        ],
                        "regexDontMatchBlock": ""
                    }
                },
                {
                    "key": "pessoa.cadastro.termos.recusados",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Infelizmente, não podemos prosseguir com o cadastro sem o aceite dos termos de privacidade. Retornando ao menu principal."
                            }
                        ]
                    }
                },
                {
                    "key": "pessoa.cadastro.nome",
                    "next": "pessoa.cadastro.nome.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Voltar\n\nPara iniciar o agendamento, por favor, informe seu nome completo:"
                            }
                        ]
                    },
                    "isFirstProcess": true
                },
                {
                    "key": "pessoa.cadastro.nome.input",
                    "next": "pessoa.cadastro.cpf",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "inicio.bemvindo"
                        },
                        "regex": "^[A-Za-zÀ-ÖØ-öø-ÿ\\s]{3,}(\\s[A-Za-zÀ-ÖØ-öø-ÿ\\s]{2,})+$",
                        "variable": {
                            "key": "nome_completo",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [],
                        "regexDontMatchBlock": "pessoa.cadastro.nome.input.erro"
                    }
                },
                {
                    "key": "pessoa.cadastro.nome.input.erro",
                    "next": "pessoa.cadastro.nome.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Voltar\n\nPor favor, digite seu nome completo (nome e sobrenome):"
                            }
                        ]
                    }
                },
                {
                    "key": "pessoa.cadastro.cpf",
                    "next": "pessoa.cadastro.cpf.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Voltar\n\nInforme seu CPF (apenas números):"
                            }
                        ]
                    }
                },
                {
                    "key": "pessoa.cadastro.cpf.input",
                    "next": "pessoa.cadastro.data.nascimento",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "pessoa.cadastro.nome"
                        },
                        "regex": "^[0-9]{11}$",
                        "variable": {
                            "key": "cpf",
                            "type": "MEMORY"
                        },
                        "validator": "cpf",
                        "conditions": [],
                        "regexDontMatchBlock": "pessoa.cadastro.cpf.input.erro"
                    }
                },
                {
                    "key": "pessoa.cadastro.cpf.input.erro",
                    "next": "pessoa.cadastro.cpf.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Voltar\n\nCPF inválido. Por favor, digite apenas os 11 números do seu CPF, sem pontos ou traços."
                            }
                        ]
                    }
                },
                {
                    "key": "pessoa.cadastro.data.nascimento",
                    "next": "pessoa.cadastro.data.nascimento.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Voltar\n\nInforme sua data de nascimento (formato DD/MM/AAAA):"
                            }
                        ]
                    }
                },
                {
                    "key": "pessoa.cadastro.data.nascimento.input",
                    "next": "pessoa.cadastro.genero",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "pessoa.cadastro.cpf"
                        },
                        "regex": "^\\d{2}/\\d{2}/\\d{4}$",
                        "variable": {
                            "key": "birthDate",
                            "type": "MEMORY"
                        },
                        "validator": "birthdate",
                        "conditions": [],
                        "regexDontMatchBlock": "pessoa.cadastro.data.nascimento.input.regex.erro"
                    }
                },
                {
                    "key": "pessoa.cadastro.data.nascimento.input.regex.erro",
                    "next": "pessoa.cadastro.data.nascimento.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Voltar\n\nData de nascimento inválida. Por favor, informe a data no formato DD/MM/AAAA."
                            }
                        ]
                    }
                },
                {
                    "key": "pessoa.cadastro.genero",
                    "next": "pessoa.cadastro.genero.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Por último, informe seu gênero:\n\nSelecione o número da opção desejada:\n\n0 - Voltar\n1 - Masculino\n2 - Feminino\n3 - Outro"
                            }
                        ]
                    }
                },
                {
                    "key": "pessoa.cadastro.genero.input",
                    "next": "agendamento.start",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "pessoa.cadastro.data.nascimento"
                        },
                        "regex": "^[1-3]$",
                        "variable": {
                            "key": "genero_input",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "SET",
                                    "value": "H",
                                    "variable": {
                                        "key": "genero",
                                        "type": "MEMORY"
                                    }
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "SET",
                                    "value": "M",
                                    "variable": {
                                        "key": "genero",
                                        "type": "MEMORY"
                                    }
                                }
                            },
                            {
                                "value": "3",
                                "action": {
                                    "type": "SET",
                                    "value": "A",
                                    "variable": {
                                        "key": "genero",
                                        "type": "MEMORY"
                                    }
                                }
                            }
                        ],
                        "regexDontMatchBlock": "pessoa.cadastro.genero.input.erro"
                    }
                },
                {
                    "key": "pessoa.cadastro.genero.input.erro",
                    "next": "pessoa.cadastro.genero",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "pessoa.cadastro.confirmacao",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Agradecemos pelas informações fornecidas. Seus dados foram registrados com sucesso!\n\nAqui está um resumo dos dados informados:\n- CPF: ${memory.cpf}\n- Data de Nascimento: ${memory.data_nascimento}\n- Gênero: ${memory.genero}\n\nVoltando ao menu principal..."
                            }
                        ]
                    },
                    "useMemory": true
                }
            ],
            "description": "Fluxo de novo agendamento"
        },
        {
            "key": "Cadastro de agendamento",
            "blocks": [
                {
                    "key": "agendamento.start",
                    "next": "agendamento.tipo.atendimento.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Qual o tipo de atendimento desejado?\n\nSelecione o número da opção desejada:\n\n0 - Voltar\n1 - Particular\n2 - Convênio"
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.tipo.atendimento.input",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "pessoa.cadastro.genero"
                        },
                        "regex": "^[12]$",
                        "variable": {
                            "key": "tipo_atendimento",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.set.particular.id"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.convenios.request"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "agendamento.tipo.atendimento.input.erro"
                    }
                },
                {
                    "key": "agendamento.tipo.atendimento.input.erro",
                    "next": "agendamento.start",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.set.particular.id",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.set.particular.nome",
                        "type": "SET",
                        "value": "12",
                        "variable": {
                            "key": "convenioId",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "agendamento.set.particular.nome",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.especialidades.request",
                        "type": "SET",
                        "value": "Particular",
                        "variable": {
                            "key": "convenioNome",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "agendamento.convenios.request",
                    "next": "agendamento.selecionar_convenio",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/insurance",
                        "body": "",
                        "type": "GET",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.convenios.list"
                                },
                                "status": 200,
                                "saveResponse": true
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.convenios.list",
                    "next": "agendamento.input_convenio",
                    "type": "DYNAMIC_MESSAGE",
                    "dynamicMessage": {
                        "listKey": "",
                        "message": {
                            "contents": [
                                {
                                    "value": "Selecione o número da opção desejada:\n\n0 - Voltar"
                                }
                            ]
                        },
                        "onEmpty": "",
                        "valueKey": "id",
                        "messageKey": "name"
                    }
                },
                {
                    "key": "agendamento.input_convenio",
                    "next": "agendamento.salvar.convenioId",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "agendamento.tipo.atendimento.input"
                        },
                        "regex": "^[0-9]+$",
                        "variable": {
                            "key": "convenioIndex",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [],
                        "regexDontMatchBlock": "agendamento.input_convenio.erro.formato"
                    }
                },
                {
                    "key": "agendamento.input_convenio.erro.formato",
                    "next": "agendamento.convenios.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Voltar\n\nPor favor, digite apenas o número do convênio desejado."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.convenioId",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.salvar.convenioNome",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "convenioId",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "id",
                            "index": "memory.convenioIndex",
                            "isList": true,
                            "onNotFound": "agendamento.input_convenio.erro.opcao"
                        }
                    }
                },
                {
                    "key": "agendamento.input_convenio.erro.opcao",
                    "next": "agendamento.convenios.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.convenioNome",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.planos.request",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "convenioNome",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "name",
                            "index": "memory.convenioIndex",
                            "isList": true,
                            "onNotFound": "agendamento.convenios.list"
                        }
                    }
                },
                {
                    "key": "agendamento.planos.request",
                    "next": "agendamento.planos.list",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/plans/${memory.convenioId}",
                        "body": "",
                        "type": "GET",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.planos.list"
                                },
                                "status": 200,
                                "saveResponse": true
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.planos.list",
                    "next": "agendamento.input_plano",
                    "type": "DYNAMIC_MESSAGE",
                    "dynamicMessage": {
                        "listKey": "",
                        "message": {
                            "contents": [
                                {
                                    "value": "Selecione o plano digitando o número correspondente:\n\n0 - Voltar"
                                }
                            ]
                        },
                        "onEmpty": "",
                        "valueKey": "id",
                        "messageKey": "name"
                    }
                },
                {
                    "key": "agendamento.input_plano",
                    "next": "agendamento.salvar.planoId",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "agendamento.convenios.request"
                        },
                        "regex": "^[0-9]+$",
                        "variable": {
                            "key": "planoIndex",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [],
                        "regexDontMatchBlock": "agendamento.input_plano.erro.formato"
                    }
                },
                {
                    "key": "agendamento.input_plano.erro.formato",
                    "next": "agendamento.planos.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Voltar\n\nPor favor, digite apenas o número do plano desejado."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.planoId",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.especialidades.request",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "planoId",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "id",
                            "index": "memory.planoIndex",
                            "isList": true,
                            "onNotFound": "agendamento.input_plano.erro.opcao"
                        }
                    }
                },
                {
                    "key": "agendamento.input_plano.erro.opcao",
                    "next": "agendamento.planos.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.especialidades.request",
                    "next": "agendamento.especialidades.list",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/specialties?insuranceId=${memory.convenioId}&serviceId=1&gender=${memory.genero}",
                        "body": "",
                        "type": "GET",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.especialidades.list"
                                },
                                "status": 200,
                                "saveResponse": true
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.especialidades.list",
                    "next": "agendamento.input_especialidade",
                    "type": "DYNAMIC_MESSAGE",
                    "dynamicMessage": {
                        "listKey": "",
                        "message": {
                            "contents": [
                                {
                                    "value": "Selecione a especialidade digitando o número correspondente:\n\n0 - Voltar"
                                }
                            ]
                        },
                        "onEmpty": "",
                        "valueKey": "id",
                        "messageKey": "name"
                    }
                },
                {
                    "key": "agendamento.input_especialidade",
                    "next": "agendamento.salvar.especialidadeId",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "agendamento.start"
                        },
                        "regex": "^[0-9]+$",
                        "variable": {
                            "key": "especialidadeIndex",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [],
                        "regexDontMatchBlock": "agendamento.input_especialidade.erro.formato"
                    }
                },
                {
                    "key": "agendamento.input_especialidade.erro.formato",
                    "next": "agendamento.especialidades.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.especialidadeId",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.salvar.especialidadeNome",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "especialidadeId",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "id",
                            "index": "memory.especialidadeIndex",
                            "isList": true,
                            "onNotFound": "agendamento.input_especialidade.erro.opcao"
                        }
                    }
                },
                {
                    "key": "agendamento.input_especialidade.erro.opcao",
                    "next": "agendamento.especialidades.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.especialidadeNome",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.validar.especialidade.atendimento",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "especialidadeNome",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "name",
                            "index": "memory.especialidadeIndex",
                            "isList": true
                        }
                    }
                },
                {
                    "key": "agendamento.especialidades.validar.genero",
                    "next": "agendamento.especialidades.list",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/check-specialty?specialtyId=${memory.especialidadeId}&gender=${memory.genero}",
                        "body": "",
                        "type": "GET",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.salvar.validar.genero.salvar.resposta"
                                },
                                "status": 200,
                                "saveResponse": true
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.validar.genero.salvar.resposta",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.salvar.validar.genero",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "especialidadeGenero",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "id",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "agendamento.salvar.validar.genero",
                    "type": "CONDITION",
                    "conditions": [
                        {
                            "next": "agendamento.medicos.request",
                            "condition": {
                                "key": {
                                    "key": "memory.especialidadeGenero",
                                    "type": "MEMORY"
                                },
                                "type": "EQUAL",
                                "value": "true"
                            }
                        },
                        {
                            "next": "agendamento.especialidades.validar.genero.erro.genero",
                            "condition": {
                                "key": {
                                    "key": "memory.especialidadeGenero",
                                    "type": "MEMORY"
                                },
                                "type": "NOT_EQUAL",
                                "value": "true"
                            }
                        }
                    ]
                },
                {
                    "key": "agendamento.especialidades.validar.genero.erro.genero",
                    "next": "inicio.bemvindo",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Sua especialidade não atende ao gênero selecionado."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.medicos.request",
                    "next": "agendamento.medicos.request.webhook",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Aguarde um momento enquanto consultamos no nosso sistema, esse processo pode levar até 1 minuto..."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.medicos.request.webhook",
                    "next": "agendamento.medicos.list",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/doctors?insuranceId=${memory.convenioId}&specialtyId=${memory.especialidadeId}&birthDate=${memory.birthDate}&gender=${memory.genero}",
                        "body": "",
                        "type": "GET",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.medicos.list"
                                },
                                "status": 200,
                                "saveResponse": true
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.medicos.list",
                    "next": "agendamento.input_medico",
                    "type": "DYNAMIC_MESSAGE",
                    "dynamicMessage": {
                        "listKey": "",
                        "message": {
                            "contents": [
                                {
                                    "value": "Selecione o médico digitando o número correspondente:\n\n0 - Voltar"
                                }
                            ]
                        },
                        "onEmpty": "erro.nenhum.resultado.encontrado",
                        "valueKey": "id",
                        "messageKey": "name"
                    }
                },
                {
                    "key": "agendamento.input_medico",
                    "next": "agendamento.salvar.medicoId",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "agendamento.especialidades.request"
                        },
                        "regex": "^[1-9]+$",
                        "variable": {
                            "key": "medicoIndex",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [],
                        "regexDontMatchBlock": "agendamento.input_medico.erro.formato"
                    }
                },
                {
                    "key": "agendamento.input_medico.erro.formato",
                    "next": "agendamento.medicos.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.medicoId",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.salvar.medicoNome",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "medicoId",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "id",
                            "index": "memory.medicoIndex",
                            "isList": true,
                            "onNotFound": "agendamento.input_medico.erro.opcao"
                        }
                    }
                },
                {
                    "key": "agendamento.input_medico.erro.opcao",
                    "next": "agendamento.medicos.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.medicoNome",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.salvar.medicoBotAutomaticSchedule",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "medicoNome",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "name",
                            "index": "memory.medicoIndex",
                            "isList": true,
                            "onNotFound": "agendamento.selecionar_medico_on_empty"
                        }
                    }
                },
                {
                    "key": "agendamento.salvar.medicoBotAutomaticSchedule",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.validar.medicoBotAutomaticSchedule",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "medicoBotAutomaticSchedule",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "values.botAutomaticSchedule",
                            "index": "memory.medicoIndex",
                            "isList": true
                        }
                    }
                },
                {
                    "key": "agendamento.validar.medicoBotAutomaticSchedule",
                    "type": "CONDITION",
                    "conditions": [
                        {
                            "next": "agendamento.agendas.request",
                            "condition": {
                                "key": {
                                    "key": "memory.medicoBotAutomaticSchedule",
                                    "type": "MEMORY"
                                },
                                "type": "EQUAL",
                                "value": "true"
                            }
                        },
                        {
                            "next": "agendamento.agendas.medicoNotAutomaticSchedule",
                            "condition": {
                                "key": {
                                    "key": "memory.medicoBotAutomaticSchedule",
                                    "type": "MEMORY"
                                },
                                "type": "NOT_EQUAL",
                                "value": "true"
                            }
                        }
                    ]
                },
                {
                    "key": "agendamento.agendas.medicoNotAutomaticSchedule",
                    "next": "agendamento.agendas.medicoNotAutomaticSchedule.action_protocol_start",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Médico não possui agendamento automático, um atendente entrará em contato para auxiliar o agendamento..."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.agendas.medicoNotAutomaticSchedule.action_protocol_start",
                    "type": "ACTION",
                    "action": {
                        "next": "",
                        "type": "START_PROTOCOL",
                        "value": "",
                        "variable": {
                            "key": "",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "agendamento.agendas.request",
                    "next": "agendamento.agendas.list",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/schedule/days?scheduleId=${memory.medicoId}&insuranceId=${memory.convenioId}&specialtyId=${memory.especialidadeId}",
                        "body": "",
                        "type": "GET",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.agendas.list"
                                },
                                "status": 200,
                                "saveResponse": true
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.agendas.list",
                    "next": "agendamento.input_agenda",
                    "type": "DYNAMIC_MESSAGE",
                    "dynamicMessage": {
                        "listKey": "",
                        "message": {
                            "contents": [
                                {
                                    "value": "Selecione a data da agenda digitando o número correspondente:\n\n0 - Voltar"
                                }
                            ]
                        },
                        "onEmpty": "erros.servico.indisponivel",
                        "valueKey": "id",
                        "messageKey": "name"
                    }
                },
                {
                    "key": "agendamento.input_agenda",
                    "next": "agendamento.salvar.agendaId",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "agendamento.medicos.request"
                        },
                        "regex": "^[0-9]+$",
                        "variable": {
                            "key": "agendaIndex",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [],
                        "regexDontMatchBlock": "agendamento.input_agenda.erro.formato"
                    }
                },
                {
                    "key": "agendamento.input_agenda.erro.formato",
                    "next": "agendamento.agendas.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.agendaId",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.salvar.agenda_descricao",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "agendaId",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "id",
                            "index": "memory.agendaIndex",
                            "isList": true,
                            "onNotFound": "agendamento.input_agenda.erro.opcao"
                        }
                    }
                },
                {
                    "key": "agendamento.input_agenda.erro.opcao",
                    "next": "agendamento.agendas.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.agenda_descricao",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.horarios.request",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "agendaName",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "name",
                            "index": "memory.agendaIndex",
                            "isList": true,
                            "onNotFound": "agendamento.agendas.list"
                        }
                    }
                },
                {
                    "key": "agendamento.horarios.request",
                    "next": "agendamento.horarios.list",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/day?date=${memory.agendaId}&scheduleId=${memory.medicoId}&insuranceId=${memory.convenioId}&specialtyId=${memory.especialidadeId}",
                        "body": "",
                        "type": "GET",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.horarios.list"
                                },
                                "status": 200,
                                "saveResponse": true
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.horarios.list",
                    "next": "agendamento.input_horario",
                    "type": "DYNAMIC_MESSAGE",
                    "dynamicMessage": {
                        "listKey": "",
                        "message": {
                            "contents": [
                                {
                                    "value": "Selecione o horário digitando o número correspondente:\n\n0 - Voltar"
                                }
                            ]
                        },
                        "onEmpty": "erros.servico.indisponivel",
                        "valueKey": "id",
                        "messageKey": "name"
                    }
                },
                {
                    "key": "agendamento.selecionar_horario_on_empty",
                    "next": "agendamento.horarios.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Selecione o número do horário existente na lista...\n\n0 - Voltar"
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.input_horario",
                    "next": "agendamento.salvar.horario",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "agendamento.agendas.request"
                        },
                        "regex": "^[1-9]+$",
                        "variable": {
                            "key": "horarioIndex",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [],
                        "regexDontMatchBlock": "agendamento.input_horario.erro.formato"
                    }
                },
                {
                    "key": "agendamento.input_horario.erro.formato",
                    "next": "agendamento.horarios.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.horario",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.salvar.id",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "horarioDescricao",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "name",
                            "index": "memory.horarioIndex",
                            "isList": true,
                            "onNotFound": "agendamento.input_horario.erro.opcao"
                        }
                    }
                },
                {
                    "key": "agendamento.input_horario.erro.opcao",
                    "next": "agendamento.horarios.list",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.id",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.salvar.local",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "scheduleBookId",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "id",
                            "index": "memory.horarioIndex",
                            "isList": true,
                            "onNotFound": "agendamento.selecionar_horario_on_empty"
                        }
                    }
                },
                {
                    "key": "agendamento.salvar.local",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.confirmacao",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "location",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "values.location",
                            "index": "memory.horarioIndex",
                            "isList": true,
                            "onEmpty": "Local: -"
                        }
                    }
                },
                {
                    "key": "agendamento.confirmacao",
                    "type": "CONDITION",
                    "conditions": [
                        {
                            "next": "agendamento.confirmacao.salvar.particular.preco",
                            "condition": {
                                "key": {
                                    "key": "memory.convenioId",
                                    "type": "MEMORY"
                                },
                                "type": "EQUAL",
                                "value": "12"
                            }
                        },
                        {
                            "next": "agendamento.confirmacao.convenio",
                            "condition": {
                                "key": {
                                    "key": "memory.convenioId",
                                    "type": "MEMORY"
                                },
                                "type": "NOT_EQUAL",
                                "value": "12"
                            }
                        }
                    ]
                },
                {
                    "key": "agendamento.confirmacao.salvar.particular.preco",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.confirmacao.salvar.particular.forma_pagamento",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "privateValue",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "values.privateValue",
                            "index": "memory.horarioIndex",
                            "isList": true,
                            "onNotFound": "agendamento.input_horario.erro.opcao"
                        }
                    }
                },
                {
                    "key": "agendamento.confirmacao.salvar.particular.forma_pagamento",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.confirmacao.particular",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "paymentMethod",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "values.paymentMethod",
                            "index": "memory.horarioIndex",
                            "isList": true,
                            "onNotFound": "agendamento.input_horario.erro.opcao"
                        }
                    }
                },
                {
                    "key": "agendamento.confirmacao.particular",
                    "next": "agendamento.confirmacao.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Você selecionou o seguinte agendamento:\n\nEspecialidade: ${memory.especialidadeNome}\nMédico: ${memory.medicoNome}\nData: ${memory.agendaName} | Hora: ${memory.horarioDescricao}\nValor: R$ ${memory.privateValue}\n${memory.paymentMethod}\n${memory.location}\n\nSelecione o número da opção desejada:\n1 - Sim, confirmar agendamento.\n2 - Não, cancelar agendamento.\n3 - Desejo alterar o agendamento."
                            }
                        ]
                    },
                    "useMemory": true
                },
                {
                    "key": "agendamento.confirmacao.convenio",
                    "next": "agendamento.confirmacao.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Você selecionou o seguinte agendamento:\n\nConvênio: ${memory.convenioNome}\nEspecialidade: ${memory.especialidadeNome}\nMédico: ${memory.medicoNome}\nData: ${memory.agendaName} | Hora: ${memory.horarioDescricao}\n${memory.location}\n\nSelecione o número da opção desejada:\n1 - Sim, confirmar agendamento.\n2 - Não, cancelar agendamento.\n3 - Desejo alterar o agendamento."
                            }
                        ]
                    },
                    "useMemory": true
                },
                {
                    "key": "agendamento.confirmacao.input",
                    "type": "INPUT",
                    "input": {
                        "regex": "^[1-3]$",
                        "variable": {
                            "key": "confirmacao",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.check-availability"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.cancelado"
                                }
                            },
                            {
                                "value": "3",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.alterar.confirmacao"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "agendamento.confirmacao.input.erro"
                    }
                },
                {
                    "key": "agendamento.confirmacao.input.erro",
                    "next": "agendamento.confirmacao",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.alterar.confirmacao",
                    "next": "agendamento.alterar.confirmacao.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Alterar o agendamento fará com que você volte a etapa do *tipo de atendimento* (Convênio ou Plano). Deseja continuar?\n\nSelecione o número da opção desejada:\n\n1 - Sim, desejo voltar.\n2 - Não, manter o agendamento atual."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.alterar.confirmacao.input",
                    "type": "INPUT",
                    "input": {
                        "regex": "^[1-2]$",
                        "variable": {
                            "key": "confirmacao_alteracao",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.start"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.confirmacao"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "agendamento.alterar.confirmacao.input.erro"
                    }
                },
                {
                    "key": "agendamento.check-availability",
                    "next": "agendamento.salvar",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/check-availability?scheduleId=${memory.scheduleBookId}&insuranceId=${memory.convenioId}",
                        "body": "",
                        "type": "GET",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.salvar"
                                },
                                "status": 200,
                                "saveResponse": true
                            },
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.agendas.check-availability.error"
                                },
                                "status": 400
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.check-availability.error",
                    "next": "agendamento.agendas.request",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Voltar\n\nCota indisponível, horário acabou de ser ocupado por outro paciente, escolha outra data e horário"
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar",
                    "next": "agendamento.salvar.idPessoa",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/appointment",
                        "body": "{\"name\":\"${memory.nome_completo}\",\"document\":\"${memory.cpf}\",\"phone\":\"${database.phone}\",\"personId\":\"${memory.personId}\",\"scheduleId\":\"${memory.scheduleBookId}\",\"hospitalId\":1,\"insuranceId\":\"${memory.convenioId}\", \"birthDate\":\"${memory.birthDate}\"}",
                        "type": "POST",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.salvar.idPessoa"
                                },
                                "status": 200,
                                "saveResponse": true
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.salvar.idPessoa",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.schedule_alert_appointment",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "personId",
                            "type": "DATABASE"
                        },
                        "responseValue": {
                            "key": "id",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "agendamento.schedule_alert_appointment",
                    "type": "SCHEDULE_ALERT",
                    "useMemory": true,
                    "scheduleAlert": {
                        "alertId": "1",
                        "onError": "agendamento.finalizado",
                        "onSuccess": "agendamento.finalizado",
                        "externalId": "${memory.scheduleBookId}",
                        "scheduleDate": {
                            "date": "${memory.agendaName}",
                            "time": "${memory.horarioDescricao}:00",
                            "format": "DATE_SIMPLE"
                        },
                        "beforeReminders": [
                            {
                                "hours": 48
                            },
                            {
                                "hours": 24
                            },
                            {
                                "hours": 3
                            }
                        ],
                        "companyIdVariable": "1",
                        "variablesVariable": {
                            "scheduleId": "${memory.scheduleBookId}"
                        }
                    }
                },
                {
                    "key": "agendamento.finalizado",
                    "next": "agendamentofinalizado.orientacao",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Seu agendamento foi confirmado com sucesso!\n\nSeu numero de agendamento é: *${memory.scheduleBookId}*\n\nObrigado por utilizar nossos serviços."
                            }
                        ]
                    },
                    "useMemory": true
                },
                {
                    "key": "agendamentofinalizado.orientacao",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Compareça ao Hospital 30 minutos antes do horário agendado. Não esqueça de trazer seus documentos e carteirinha do convênio. Até breve!"
                            }
                        ]
                    },
                    "isEndProcess": true
                },
                {
                    "key": "agendamento.cancelado",
                    "next": "inicio.bemvindo",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Agendamento cancelado. Voltando ao menu principal..."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.alterar.opcoes",
                    "next": "agendamento.alterar.opcoes.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "O que você deseja alterar?\n\nSelecione o número da opção desejada:\n\n0 - Voltar\n\n1 - Tipo de atendimento (Particular/Convênio)\n2 - Convênio\n3 - Plano\n4 - Especialidade\n5 - Médico\n6 - Data\n7 - Horário\n8 - Voltar para confirmação"
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.alterar.opcoes.input",
                    "type": "INPUT",
                    "input": {
                        "regex": "^[1-8]$",
                        "variable": {
                            "key": "opcao_alteracao",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.start"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.convenios.request"
                                }
                            },
                            {
                                "value": "3",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.planos.request"
                                }
                            },
                            {
                                "value": "4",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.especialidades.request"
                                }
                            },
                            {
                                "value": "5",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.medicos.request"
                                }
                            },
                            {
                                "value": "6",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.agendas.request"
                                }
                            },
                            {
                                "value": "7",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.horarios.request"
                                }
                            },
                            {
                                "value": "8",
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.confirmacao"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "agendamento.alterar.opcoes.erro"
                    }
                },
                {
                    "key": "agendamento.alterar.opcoes.erro",
                    "next": "agendamento.alterar.opcoes",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                }
            ],
            "description": ""
        },
        {
            "key": "Erros",
            "blocks": [
                {
                    "key": "erros.servico.indisponivel",
                    "next": "protocol.start.iniciar",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Desculpe, estamos com uma instabilidade temporária no sistema. Para garantir seu atendimento, vou te direcionar para um de nossos atendentes.\n\nPor favor, aguarde um momento."
                            }
                        ]
                    }
                },
                {
                    "key": "erro.nenhum.resultado.encontrado",
                    "next": "inicio.bemvindo",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Nenhum médico disponivel para agendamentos no momento."
                            }
                        ]
                    }
                },
                {
                    "key": "erro.nenhum.resultado.encontrado.input",
                    "type": "INPUT",
                    "input": {
                        "regex": "^[12]$",
                        "variable": {
                            "key": "opcao_atendente",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "protocol.start.iniciar"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "erro.nenhum.resultado.encontrado.fim"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "erro.nenhum.resultado.encontrado.input.erro"
                    }
                },
                {
                    "key": "erro.nenhum.resultado.encontrado.input.erro",
                    "next": "erro.nenhum.resultado.encontrado",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Opção inválida."
                            }
                        ]
                    }
                },
                {
                    "key": "erro.nenhum.resultado.encontrado.fim",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Obrigado por utilizar nosso atendimento. Caso queira iniciar um novo atendimento, basta entrar em contato novamente. \n\nAté breve!"
                            }
                        ]
                    }
                }
            ],
            "description": ""
        },
        {
            "key": "Protocol",
            "blocks": [
                {
                    "key": "protocol.start.iniciar.mensagem",
                    "next": "protocol.start.iniciar",
                    "skip": true,
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Protocolo iniciado. Por favor aguarde o atendente. Um de nossos representantes entrará em contato em breve."
                            }
                        ]
                    }
                },
                {
                    "key": "protocol.start.iniciar",
                    "type": "ACTION",
                    "action": {
                        "next": "",
                        "type": "START_PROTOCOL",
                        "value": "",
                        "variable": {
                            "key": "",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "protocol.start",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Olá! Como podemos te ajudar? Deixe sua solicitação e aguarde, em breve você será atendido(a) por um de nossos atendentes.\n\nCaso precise cancelar o atendimento, digite *sair*."
                            }
                        ]
                    }
                },
                {
                    "key": "protocol.canceled",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "O protocolo foi cancelado. Se precisar de assistência, por favor, inicie um novo atendimento."
                            }
                        ]
                    }
                },
                {
                    "key": "protocol.end",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "O protocolo foi encerrado. Obrigado por utilizar nosso atendimento."
                            }
                        ]
                    }
                },
                {
                    "key": "protocol.schedule",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Você está na fila de atendimento. Por favor, aguarde. Um de nossos representantes entrará em contato assim que possível.\n\nCaso precise cancelar o atendimento, digite *sair*."
                            }
                        ]
                    }
                }
            ],
            "description": ""
        },
        {
            "key": "AgendamentoAlertas",
            "blocks": [
                {
                    "key": "agendamento.alerta",
                    "next": "agendamento.alerta.selecionar",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/appointment/${memory.scheduleId}",
                        "body": "",
                        "type": "GET",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "agendamento.alerta.selecionar.nome"
                                },
                                "status": 200,
                                "saveResponse": true
                            }
                        ]
                    },
                    "description": "Alerta de agendamento"
                },
                {
                    "key": "agendamento.alerta.selecionar.nome",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.alerta.selecionar.nomeMedico",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "agendamentoAlertaNomePessoa",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "values.personName",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "agendamento.alerta.selecionar.nomeMedico",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.alerta.selecionar.data",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "agendamentoAlertaNomeMedico",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "values.doctorName",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "agendamento.alerta.selecionar.data",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.alerta.selecionar.hora",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "agendamentoAlertaData",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "values.dateString",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "agendamento.alerta.selecionar.hora",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.alerta.selecionar.local",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "agendamentoAlertaHora",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "values.time",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "agendamento.alerta.selecionar.local",
                    "type": "ACTION",
                    "action": {
                        "next": "agendamento.alerta.exibir.modelo",
                        "type": "RESPONSE_VALUE",
                        "value": "",
                        "variable": {
                            "key": "agendamentoAlertaLocal",
                            "type": "MEMORY"
                        },
                        "responseValue": {
                            "key": "values.location",
                            "isList": false
                        }
                    }
                },
                {
                    "key": "agendamento.alerta.exibir.modelo",
                    "next": "appointment.confirmation.input",
                    "type": "TEMPLATE",
                    "template": {
                        "name": "avh_lembrete_consulta_v2",
                        "language": "pt_BR",
                        "components": {
                            "1": "${memory.agendamentoAlertaNomePessoa}",
                            "2": "${memory.agendamentoAlertaData}",
                            "3": "${memory.agendamentoAlertaHora}",
                            "4": "${memory.agendamentoAlertaNomeMedico}",
                            "5": "${memory.agendamentoAlertaLocal}"
                        }
                    },
                    "useMemory": true,
                    "isFirstProcess": true
                },
                {
                    "key": "appointment.confirmation.input",
                    "type": "INPUT",
                    "input": {
                        "regex": "",
                        "variable": {
                            "key": "",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "Confirmar Presença",
                                "action": {
                                    "type": "GOTO",
                                    "value": "appointment.confirmed.update_alert_status"
                                }
                            },
                            {
                                "value": "Cancelar",
                                "action": {
                                    "type": "GOTO",
                                    "value": "appointment.canceled.update_alert_status"
                                }
                            },
                            {
                                "value": "Remarcar Consulta",
                                "action": {
                                    "type": "GOTO",
                                    "value": "inicio.bemvindo"
                                }
                            }
                        ],
                        "regexDontMatchBlock": ""
                    }
                },
                {
                    "key": "appointment.confirmed.update_alert_status",
                    "next": "appointment.confirmed.request",
                    "type": "ALERT_STATUS",
                    "useMemory": true,
                    "alertStatus": {
                        "error": null,
                        "status": "REPLIED",
                        "response": "CONFIRMED",
                        "alertIdVariable": "memory.alertDispatchId"
                    }
                },
                {
                    "key": "appointment.canceled.update_alert_status",
                    "next": "appointment.canceled.request",
                    "type": "ALERT_STATUS",
                    "useMemory": true,
                    "alertStatus": {
                        "error": null,
                        "status": "REPLIED",
                        "response": "CANCELLED",
                        "alertIdVariable": "memory.alertDispatchId"
                    }
                },
                {
                    "key": "appointment.confirmed.request",
                    "next": "appointment.confirmed",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/appointment/${memory.scheduleId}/confirm",
                        "body": "",
                        "type": "OPTIONS",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "appointment.confirmed"
                                },
                                "status": 204
                            },
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "appointment.confirmed"
                                },
                                "status": 200
                            }
                        ]
                    }
                },
                {
                    "key": "appointment.confirmed",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Sua consulta foi confirmada com sucesso. \n\nHED agradece a sua preferência, até breve!"
                            }
                        ]
                    }
                },
                {
                    "key": "appointment.canceled.request",
                    "next": "appointment.canceled",
                    "type": "WEBHOOK",
                    "webhook": {
                        "url": "http://ms-hospital/api/hospital/bot/appointment/${memory.scheduleId}/cancel",
                        "body": "",
                        "type": "OPTIONS",
                        "statuses": [
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "appointment.canceled"
                                },
                                "status": 204
                            },
                            {
                                "action": {
                                    "type": "GOTO",
                                    "value": "appointment.canceled"
                                },
                                "status": 200
                            }
                        ]
                    }
                },
                {
                    "key": "appointment.canceled",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Sua consulta foi cancelada com sucesso. \n\nPara outra solicitação, entre em contato novamente."
                            }
                        ]
                    }
                }
            ],
            "description": ""
        },
        {
            "key": "agendamentos.validar.especialidade",
            "blocks": [
                {
                    "key": "agendamento.validar.especialidade.atendimento",
                    "next": "agendamento.medicos.request",
                    "type": "CONDITION",
                    "conditions": [
                        {
                            "next": "agendamento.validar.especialidade.cancerologia",
                            "condition": {
                                "key": {
                                    "key": "memory.especialidadeId",
                                    "type": "MEMORY"
                                },
                                "type": "EQUAL",
                                "value": "158"
                            }
                        },
                        {
                            "next": "agendamento.validar.especialidade.cancerologia",
                            "condition": {
                                "key": {
                                    "key": "memory.especialidadeId",
                                    "type": "MEMORY"
                                },
                                "type": "EQUAL",
                                "value": "178"
                            }
                        },
                        {
                            "next": "agendamento.validar.especialidade.nefrologia",
                            "condition": {
                                "key": {
                                    "key": "memory.especialidadeId",
                                    "type": "MEMORY"
                                },
                                "type": "EQUAL",
                                "value": "191"
                            }
                        },
                        {
                            "next": "agendamento.validar.especialidade.hepatologia",
                            "condition": {
                                "key": {
                                    "key": "memory.especialidadeId",
                                    "type": "MEMORY"
                                },
                                "type": "EQUAL",
                                "value": "302"
                            }
                        }
                    ]
                },
                {
                    "key": "agendamento.validar.especialidade.cancerologia",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "⚕️ Onco Hematologia e Cancerologia, Hemoterapia - Centro de Infusões\n\nPara agendamentos nesta especialidade, por favor entre em contato através do WhatsApp:\n\n📱 (51) 3217-8550\n\nNossos atendentes terão prazer em auxiliá-lo.\n\nCaso tenha mais alguma dúvida, entre em contato novamente, teremos prazer em te atender!\n\nO HED agradece a sua compreensão."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.validar.especialidade.nefrologia",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "⚕️ Nefrologia - Hemodiálise\n\nPara agendamentos nesta especialidade, por favor entre em contato através do telefone:\n\n📞 (51) 3217-8577\n\nNossos atendentes terão prazer em auxiliá-lo.\n\nCaso tenha mais alguma dúvida, entre em contato novamente, teremos prazer em te atender!\n\nO HED agradece a sua compreensão."
                            }
                        ]
                    }
                },
                {
                    "key": "agendamento.validar.especialidade.hepatologia",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "⚕️ Médico Hepatologista - Centro de Saúde Digestiva\n\nPara agendamentos nesta especialidade, por favor entre em contato através do telefone:\n\n📞 (51) 3217-8885\n\nNossos atendentes terão prazer em auxiliá-lo.\n\nCaso tenha mais alguma dúvida, entre em contato novamente, teremos prazer em te atender!\n\nO HED agradece a sua compreensão."
                            }
                        ]
                    }
                }
            ],
            "description": ""
        },
        {
            "key": "messages.system.infos",
            "blocks": [
                {
                    "key": "messages.system.infos.reset",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Nosso sistema foi atualizado! Por favor, recomece o atendimento. Basta digitar *inicio*."
                            }
                        ]
                    }
                },
                {
                    "key": "messages.system.infos.timeout",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Notamos que sua última mensagem foi há mais de 1 hora, por isso estamos encerrando o atendimento. Por favor, entre em contato novamente se precisar de assistência."
                            }
                        ]
                    }
                },
                {
                    "key": "messages.system.infos.timeout.protocol",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Notamos que você está inativo a mais de 30 minutos, por isso estamos encerrando o atendimento. Por favor, entre em contato novamente se precisar de assistência."
                            }
                        ]
                    }
                },
                {
                    "key": "messages.system.outofservice",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Olá, nosso horário de atendimento é das *09:00* ás *16:00*. Tente novamente mais tarde.\n\nO HED agradece a compreensão!"
                            }
                        ]
                    }
                },
                {
                    "key": "messages.system.holidays",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Olá, nosso atendimento está suspenso devido ao feriado. Retornaremos no próximo dia útil.\n\n O HED agradece a compreensão!"
                            }
                        ]
                    }
                },
                {
                    "key": "messages.system.weekend",
                    "next": "inicio.bemvindo",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "Olá, nosso horário de atendimento está suspenso durante o final de semana. Retornaremos no próximo dia útil.\n\n O HED agradece a compreensão!"
                            }
                        ]
                    }
                }
            ],
            "description": ""
        },
        {
            "key": "Outros",
            "blocks": [
                {
                    "key": "others.information",
                    "next": "other.input",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "🔔 Lembramos que esse canal é somente para informações sobre agendamento de consultas, se ainda estiver precisando de auxílio, digite o número correspondente à opção desejada:\n\n0 - Retornar ao menu anterior.\n\n1 - Consultar lista de convênios atendidos.\n\n2 - Consultar informações sobre serviços especializados (oncologia, hemodiálise).\n\n3 - Consultar telefones de outros setores do Hospital Ernesto Dornelles.\n\n4 - Para falar com um de nossos atendentes (Funcionamento somente de segunda à sexta, das 9h às 16h).\n\n5 - Finalizar atendimento."
                            }
                        ]
                    }
                },
                {
                    "key": "other.input",
                    "next": "inicio.termos.input",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "inicio.bemvindo"
                        },
                        "regex": "^[1-8]$",
                        "variable": {
                            "key": "other",
                            "type": "MEMORY"
                        },
                        "validator": null,
                        "conditions": [
                            {
                                "value": "1",
                                "action": {
                                    "type": "GOTO",
                                    "value": "other.insurance.list"
                                }
                            },
                            {
                                "value": "2",
                                "action": {
                                    "type": "GOTO",
                                    "value": "other.service.phones"
                                }
                            },
                            {
                                "value": "3",
                                "action": {
                                    "type": "GOTO",
                                    "value": "other.sectors.phones"
                                }
                            },
                            {
                                "value": "4",
                                "action": {
                                    "type": "GOTO",
                                    "value": "other.visit.hours"
                                }
                            },
                            {
                                "value": "5",
                                "action": {
                                    "type": "GOTO",
                                    "value": "other.schedule.sulvision"
                                }
                            },
                            {
                                "value": "6",
                                "action": {
                                    "type": "START_PROTOCOL",
                                    "value": "other.open.protocol"
                                }
                            },
                            {
                                "value": "7",
                                "action": {
                                    "type": "GOTO",
                                    "value": "other.finish.service"
                                }
                            }
                        ],
                        "regexDontMatchBlock": "inicio.termos.input.erro"
                    }
                },
                {
                    "key": "consult.information",
                    "next": "other.back",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Retornar ao menu anterior.\n\nPara informações sobre agendamento de cirurgias, entre em contato pelo telefone: (51) 3217-8600."
                            }
                        ]
                    }
                },
                {
                    "key": "other.insurance.list",
                    "next": "other.back",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Retornar ao menu anterior.\n\nConfira a lista completa de convênios no site do Hospital Ernesto Dornelles:\n\nhttps://www.hed.com.br/convenios_atendidos"
                            }
                        ]
                    }
                },
                {
                    "key": "other.service.phones",
                    "next": "other.back",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Retornar ao menu anterior.\n\nPara mais informações sobre serviços especializados, entre em contato pelos telefones abaixo:\n\nOncologia: (51) 3217-8550\n\nHemodiálise: (51) 3217-8577"
                            }
                        ]
                    }
                },
                {
                    "key": "other.sectors.phones",
                    "next": "other.back",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Retornar ao menu anterior.\n\nConsulte os telefones de outros setores do Hospital Ernesto Dornelles:\n\nTelefonista: (51) 3217-8400 ou (51) 3217-2002\n\nCentro da Mulher: (51) 3217-8404 ou WhatsApp (51) 99448-5414\n\nCentro de Infusões: (51) 3217-8550 (Telefone e WhatsApp)\n\nCentro de Neurologia e Neurocirurgia: (51) 3217-8585 (Telefone e WhatsApp)\n\nCentro de Oncologia: (51) 3217-8550 (Telefone e WhatsApp)\n\nCentro de Reumatologia: (51) 3217-1288 (Telefone e WhatsApp)\n\nCentro de Saúde Digestiva: (51) 3217-8885 (Telefone e WhatsApp)\n\nCentro de Traumatologia e Ortopedia: (51) 3217-1288 (Telefone e WhatsApp)\n\nCentro Integrado de Especialidades Médicas: (51) 3217-8585\n\nEmergência - Informações: (51) 3217-8509"
                            }
                        ]
                    }
                },
                {
                    "key": "other.visit.hours",
                    "next": "other.back",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Retornar ao menu anterior.\n\n📅 Horários de visitas:\n\nUCE (01 Familiar): 10:00 às 10:30 / 16:00 às 16:30\n\nEmergência (01 Familiar):\n\n     Leitos Pares: 11:00 às 11:20\n\n      Leitos Ímpares: 15:00 às 15:20\n\nUTI (02 Familiares):\n\nLeitos Pares: 10:00 às 10:30 / 16:00 às 16:30 / 19:30 às 20:00\n\nUnidade de Internação (02 Familiares, 01 por vez): 08:00 às 21:00 (Permanência de 30 minutos)"
                            }
                        ]
                    }
                },
                {
                    "key": "other.schedule.sulvision",
                    "next": "other.back",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Retornar ao menu anterior.\n\nPara agendamento de Oftalmologia, entre em contato com a Sulvision: 📞 (51) 3282-2207 ou WhatsApp (51) 98517-1014"
                            }
                        ]
                    }
                },
                {
                    "key": "other.open.protocol",
                    "next": "other.back",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Retornar ao menu anterior.\n\nEncaminhando para um atendente humano. Nosso atendimento humano funciona apenas de segunda à sexta, das 9h às 16h."
                            }
                        ]
                    }
                },
                {
                    "key": "other.finish.service",
                    "next": "other.back",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "0 - Retornar ao menu anterior.\n\nAgradecemos por utilizar nosso atendimento. Até breve!"
                            }
                        ]
                    }
                },
                {
                    "key": "other.back",
                    "type": "INPUT",
                    "input": {
                        "back": {
                            "to": "others.information"
                        },
                        "regex": "",
                        "variable": {
                            "key": "",
                            "type": "DATABASE"
                        },
                        "validator": null,
                        "conditions": [],
                        "regexDontMatchBlock": ""
                    }
                }
            ],
            "description": ""
        },
        {
            "key": "testes",
            "blocks": [
                {
                    "key": "testes.push",
                    "next": "testes.push.message",
                    "type": "TEMPLATE",
                    "template": {
                        "name": "ura_redirecionamento",
                        "language": "pt_BR",
                        "components": {
                            "1": "https://cos-avh.s3.us-south.cloud-object-storage.appdomain.cloud/Termo_Consentimento_Privacidade.pdf"
                        }
                    },
                    "useMemory": true,
                    "isFirstProcess": true
                },
                {
                    "key": "testes.push.message",
                    "next": "inicio.termos",
                    "type": "MESSAGE",
                    "message": {
                        "contents": [
                            {
                                "value": "${memory.msg}"
                            }
                        ]
                    },
                    "useMemory": true,
                    "isFirstProcess": true
                }
            ],
            "description": ""
        }
    ],
    "header": {
        "value": "*HED*"
    },
    "endTime": "16:00",
    "startTime": "09:00",
    "firstBlock": "inicio.termos",
    "listPrefix": " - ",
    "resetBlock": "messages.system.infos.reset",
    "weekendBlock": "messages.system.weekend",
    "cancelMessage": "sair",
    "holidaysBlock": "messages.system.holidays",
    "notFoundMessage": {
        "value": "Desculpe, não entendi sua resposta. Por favor, escolha uma das opções apresentadas.\nSe precisar recomeçar, digite 'Inicio'."
    },
    "timeoutSettings": {
        "block": "messages.system.infos.timeout",
        "hours": 0,
        "minutes": 2
    },
    "endProtocolBlock": "protocol.end",
    "outOfServiceBlock": "messages.system.outofservice",
    "requestErrorBlock": "erros.servico.indisponivel",
    "startProtocolBlock": "protocol.start",
    "timeoutProtocolBlock": "messages.system.infos.timeout.protocol",
    "canceledProtocolBlock": "protocol.canceled",
    "scheduleProtocolBlock": null
};