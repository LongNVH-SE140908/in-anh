﻿using RabbitMQ.Client;
using System.Net.Sockets;
using System.Net;
using Lucene.Net.Support;
using RabbitMQ.Client.Events;
using System.Text;
using Newtonsoft.Json;
using In_Anh.Models.RabitMQModel;
using System.Text.RegularExpressions;
using ImageMagick;
using In_Anh.Models;
using MongoDB.Driver;
using static Google.Cloud.Firestore.V1.StructuredQuery.Types;

namespace In_Anh.RabitMQ
{
    public class RabitMQConsumer : IHostedService
    {

        public IConfiguration _config;

        public readonly IMongoCollection<OrderModel> _ordersCollection;

        public readonly IRabitMQProducer _rabitMQProducer;


        public RabitMQConsumer(IConfiguration config)
        {
            _config = config;
            var client = new MongoClient(_config["ImageMgDatabase:ConnectionString"]);
            var database = client.GetDatabase(_config["ImageMgDatabase:DatabaseName"]);
            _ordersCollection = database.GetCollection<OrderModel>(_config["ImageMgDatabase:OrderCollectionName"]);

        }
        private IModel channel = null;
        private IConnection connection = null;
        private void Run()
        {
            var factory = new ConnectionFactory()
            {
                HostName = "jinnie.shop",
                VirtualHost = "/",
                UserName = "admin",
                Password = "admin"
            };
            connection = factory.CreateConnection();
            channel = connection.CreateModel();
            channel.QueueDeclare(queue: "image",
                                durable: true,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);
            channel.BasicQos(prefetchSize: 0, prefetchCount: 5, global: false);
            Console.WriteLine(" [*] Waiting for messages.");
            var consumer = new EventingBasicConsumer(this.channel);
            consumer.Received += OnMessageRecieved;
            channel.BasicConsume(queue: "image",
                                autoAck: false,
                                consumer: consumer);
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Run();
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            channel.Dispose();
            connection.Dispose();
            return Task.CompletedTask;
        }

        private void OnMessageRecieved(object model, BasicDeliverEventArgs args)
        {
            var body = args.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            var data = JsonConvert.DeserializeObject<RabitMQSendData>(message);
            var fileName = data.FileName;
            var filePath = data.Path + "\\" + fileName;
            using (var memoryStream = new MemoryStream(data.File))
            {
                string content = Encoding.UTF8.GetString(data.File);
                if (Regex.IsMatch(content, @"<script|<cross\-domain\-policy",
                    RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Multiline))
                {
                    return;
                }
                if (!Directory.Exists(data.Path))
                {
                    Directory.CreateDirectory(data.Path);
                }
                if (!File.Exists(filePath))
                {
                    using (FileStream f = File.Create(filePath))
                    {
                        f.Dispose();
                    }
                }
                memoryStream.Position = 0;
                using (MagickImage image = new MagickImage(memoryStream))
                {
                    image.Format = MagickFormat.Jpeg;
                    image.Quality = 100;
                    image.Write(filePath);
                    image.Dispose();
                }
                var issv = SaveImageAsync(data.OrderID, data.CDNPath + fileName, data.Type);

                memoryStream.Close();
            }
            Console.WriteLine(" [x] Done");
            channel.BasicAck(deliveryTag: args.DeliveryTag, multiple: false);
        }

        private async Task<bool> SaveImageAsync(string orderID, string urlImg, ImageType type)
        {

            var filter = Builders<OrderModel>.Filter.And(Builders<OrderModel>.Filter.Where(x => x.ListDetail.Any(y => y.OrderId == orderID)));
            var a = _ordersCollection.Find(filter).FirstOrDefault();

            var oldData = _ordersCollection.FindAsync(filter).Result.FirstOrDefault();
            if (oldData != null)
            {
                var dataDetails = oldData.ListDetail.ToList();
                var dataOrderDetail = dataDetails.Find(x => x.OrderId == orderID);
                if (dataOrderDetail != null)
                {
                    var dataImg = dataOrderDetail.Images?.FirstOrDefault();
                    if (dataImg == null)
                    {
                        dataOrderDetail.Images = new List<ImageModel>
                        {
                            new ImageModel()
                            {
                                Type = type,
                                OrginUrl= new List<string>{ urlImg }
                            }
                        };
                    }
                    else
                    {
                        if (dataDetails.Find(x => x.OrderId == orderID)?.Images?.ToList().Find(x => x.Type == type) == null)
                        {
                            dataOrderDetail.Images.Add(
                            new ImageModel()
                            {
                                Type = type,
                                OrginUrl= new List<string>{ urlImg }
                            }
                        );
                        }
                        else
                        {
                            dataDetails.Find(x => x.OrderId == orderID)?.Images?.ToList().Find(x => x.Type == type)?.OrginUrl.Add(urlImg);
                        }
                        
                    }

                    var update = Builders<OrderModel>.Update
                     .Set(x => x.ListDetail, dataDetails);
                    var data = await _ordersCollection.FindOneAndUpdateAsync(filter, update);
                    return true;
                }
            }
            return false;
        }
    }
}
