using System.Net;

if (args.Length != 1)
{
    Console.Error.WriteLine("Usage: HotChocolate.Fusion.AuditGateway <gateway.far>");
    return 1;
}

var fusionArchivePath = Path.GetFullPath(args[0]);

if (!File.Exists(fusionArchivePath))
{
    Console.Error.WriteLine($"The Fusion archive '{fusionArchivePath}' does not exist.");
    return 1;
}

var builder = WebApplication.CreateBuilder(new WebApplicationOptions { Args = [] });
builder.WebHost.ConfigureKestrel(options => options.Listen(IPAddress.Loopback, 4000));
builder.Services.AddHttpClient();
builder.Services
    .AddGraphQLGatewayServer()
    .AddFileSystemConfiguration(fusionArchivePath);

var app = builder.Build();
app.MapGet("/health", () => Results.Text("OK"));
app.MapGraphQLHttp("/graphql");
await app.RunAsync();
return 0;
